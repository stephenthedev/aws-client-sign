'use strict';
let should = require('should'); // jshint ignore:line
// Globalize CryptoJS dependency
global.CryptoJS = require('crypto-js');

// Since it the module exposes a global, just read and eval to expose the module here:
let AWSSigner = eval(require('fs').readFileSync(__dirname + '/aws-client-sign.js', 'utf8'));
let instance;

describe('AWSSigner', function () {
  beforeEach(() => {
    instance = new AWSSigner(
      'w89i94fauc.execute-api.us-east-1.amazonaws.com',
      'us-east-1',
      'execute-api',
      'ASIAJHYUG6SGT74QRSVQ',
      'JV1WSTAM3UauBR8nxOBuxzTTUafRW1GsYgxBqnE8',
      'AQoDYXdzEEgasALNgd5VyorBY29yAWzpGi0RyVogS1PuHQVE8jhzJT4TJ7CYnIMKbNreEwYtmyq1E7nkFUiijVW6Q9h11U0rM6+LZkcYY2YMArV3lyTHb/1KBDglumuNWSS2Ca+2Z89Lah+sK9/69V67BsNCC+DBrk9ozOiKuQ/ZD6e1zjULD8O8jxihJ8Mils5gHWqKT48BnzB/qqQTki1bz4+yrP9WH3FXpd5B572BVXDt+y11Z48aBFNtVtrcj5IlpGOxXWwzlpvrfy4TSxOChlTFYRSOJVt+npJ/d3bRnUws2cVSpoV/LGzpTKHUvg0gBjtnWlDdNeSiN40/7umWELnhrw/Yl6VIq+j9pk078ymJHEH+Dy4owkHcs3Z1keYyGdySz0Bqc3XXgNRcwcLnQSzRkKrFD9sZIJeEqrQF');
  });

  it('#constructor', () => {
    AWSSigner.should.be.a.Function; // jshint ignore:line
    (instance instanceof AWSSigner).should.be.true; // jshint ignore:line
    should.exist(instance._host);
    should.exist(instance._region);
    should.exist(instance._service);
    should.exist(instance._accessKeyId);
    should.exist(instance._secretAccessKey);
    should.exist(instance._token);
  });

  it('#signRoute', () => {
    instance.signRoute.should.be.a.Function; // jshint ignore:line
    let result = instance.signRoute('get', 'test/provision', {
      id: 10
    }, '', new Date('Mon Jan 04 2016 09:30:47 GMT-0500 (EST)'));
    console.log(result);
    result.should.be.an.Object; // jshint ignore:line
    should.exist(result['x-amz-date']);
    should.exist(result['x-amz-security-token']);
    should.exist(result['host']);
    should.exist(result['Authorization']);
  });

  it('#createQueryParameters', () => {
    instance.createQueryParameters({
      id: 1,
      name: 'stephen',
      body: 'test'
    }).should.equal('body=test&id=1&name=stephen');
  });

  it('#hashString', () => {
    instance.hashString('').toString().should.equal('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  });

  it('#hmac', () => {
    instance.hmac('', '').toString().should.equal('b613679a0814d9ec772f95d778c35fc5ff1697c493715653c6c712144292c5ad');
  });

  it('#getAmzLongDate', () => {
    instance.getAmzLongDate(new Date('1/1/01')).should.equal('20010101T050000Z');
  });

  it('#getAmzShortDate', () => {
    instance.getAmzShortDate(new Date('1/1/01')).should.equal('20010101');
  });
});
