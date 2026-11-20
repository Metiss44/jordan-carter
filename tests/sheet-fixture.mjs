import assert from 'node:assert/strict';
import { generateKeyPairSync, verify } from 'node:crypto';

// An ephemeral signing key, a sheet in memory and no HTTP passthrough.
export function googleFixture() {
  const {privateKey, publicKey} = generateKeyPairSync('rsa', {modulusLength:2048});
  const config = {
    spreadsheetId:'local-sheet', sheetId:0, clientEmail:'test@local.iam.gserviceaccount.com',
    privateKey:privateKey.export({type:'pkcs8', format:'pem'}), privateKeyId:'local',
  };
  const base = '/v4/spreadsheets/local-sheet';
  const heading = ['Prénom','Mail','Date'];
  const history = ['Historique','archive@example.invalid','2025-02-01'];
  const rows = [{cells:[...heading]}, {cells:[...history]}];
  const state = { rows, history, offline:true, loseWriteResponse:true, writes:0, clears:0, lookups:0, error:null };
  const ok = data => Response.json(data);
  const fail = status => Response.json({}, {status});
  const find = id => rows.findIndex(r => r.marker?.metadataId === id);
  const data = (cells, field) => ({values:cells.map(stringValue => ({[field]:{stringValue}}))});

  state.respond = async req => {
    try {
      const {origin, pathname} = new URL(req.url);
      assert.equal(req.method,'POST');
      if (origin === 'https://oauth2.googleapis.com') {
        assert.equal(pathname,'/token');
        const form = new URLSearchParams(await req.text());
        const [header,claims,signature] = form.get('assertion').split('.');
        assert.equal(form.get('grant_type'),'urn:ietf:params:oauth:grant-type:jwt-bearer');
        assert.ok(verify('RSA-SHA256',Buffer.from(header+'.'+claims),publicKey,Buffer.from(signature,'base64url')));
        const jwt = JSON.parse(Buffer.from(claims,'base64url'));
        assert.equal(jwt.iss,config.clientEmail);
        assert.equal(jwt.scope,'https://www.googleapis.com/auth/spreadsheets');
        assert.equal(jwt.aud,req.url);
        return ok({access_token:'fixture-only'});
      }
      assert.equal(origin,'https://sheets.googleapis.com');
      assert.equal(req.headers.get('authorization'),'Bearer fixture-only');
      const b = await req.json();
      if (pathname === base+'/developerMetadata:search') {
        state.lookups++;
        if (state.holdLookup) await state.holdLookup;
        if (state.offline) return fail(503);
        const i = find(b.dataFilters[0].developerMetadataLookup.metadataId);
        return ok(i < 0 ? {} : {matchedDeveloperMetadata:[{developerMetadata:{
          ...rows[i].marker, location:{dimensionRange:{sheetId:0, dimension:'ROWS', startIndex:i, endIndex:i+1}},
        }}]});
      }
      if (pathname === base+':getByDataFilter') {
        const grids = b.dataFilters.map(({gridRange:r}) => {
          assert.equal(r.sheetId,0);
          if (r.startColumnIndex === 2) {
            assert.equal(r.endColumnIndex,3);
            return {startColumn:2, rowData:rows.map(row => data([row.cells[2]],'effectiveValue'))};
          }
          assert.equal(r.startColumnIndex,0);
          assert.equal(r.endColumnIndex,3);
          assert.equal(r.endRowIndex,r.startRowIndex+1);
          const i = r.startRowIndex;
          return {rowData:[data(rows[i].cells.slice(0,3),i ? 'userEnteredValue' : 'effectiveValue')]};
        });
        return ok({sheets:[{properties:{sheetId:0,gridProperties:{rowCount:rows.length+10}},data:grids}]});
      }
      if (pathname === base+'/values:batchUpdateByDataFilter') {
        const d = b.data[0], f = d.dataFilter.developerMetadataLookup, i = find(f.metadataId);
        assert.equal(b.valueInputOption,'RAW');
        assert.ok(i > 0);
        assert.equal(rows[i].marker.metadataValue,f.metadataValue);
        assert.deepEqual(d.values,[['','','']]);
        rows[i].cells.splice(0,3,...d.values[0]);
        state.clears++;
        return ok({});
      }
      assert.equal(pathname,base+':batchUpdate');
      const ops = b.requests;
      if (ops[0].deleteDeveloperMetadata) {
        const f = ops[0].deleteDeveloperMetadata.dataFilter.developerMetadataLookup, i = find(f.metadataId);
        assert.ok(i > 0);
        assert.equal(rows[i].marker.metadataValue,f.metadataValue);
        delete rows[i].marker;
        return ok({});
      }
      assert.deepEqual(ops.map(op => Object.keys(op)[0]), ['insertDimension','updateCells','createDeveloperMetadata']);
      const {range} = ops[0].insertDimension, update = ops[1].updateCells, marker = ops[2].createDeveloperMetadata.developerMetadata;
      assert.equal(range.startIndex,rows.length); assert.equal(range.endIndex,range.startIndex+1);
      assert.equal(range.dimension,'ROWS'); assert.equal(range.sheetId,0);
      assert.deepEqual(marker.location.dimensionRange,range);
      assert.equal(update.start.rowIndex,range.startIndex); assert.equal(update.start.columnIndex,0);
      assert.equal(update.fields,'userEnteredValue');
      if (find(marker.metadataId) >= 0) return fail(400); // all or nothing, as on Google
      const cells = update.rows[0].values.map(v => {
        assert.equal(typeof v.userEnteredValue.stringValue,'string');
        return v.userEnteredValue.stringValue;
      });
      assert.equal(cells.length,3);
      rows.splice(range.startIndex,0,{cells,marker});
      state.writes++;
      if (state.loseWriteResponse) { state.loseWriteResponse=false; return fail(503); }
      return ok({});
    } catch (error) {
      state.error = error; // surface assertion failures rather than treating them as transient network errors
      return fail(500);
    }
  };
  return {config:JSON.stringify(config), state};
}
