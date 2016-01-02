/* globals CryptoJS */
/* exported AWSSigner */

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AWSSigner = (function () {
  function AWSSigner(host, region, service, accessKeyId, secretAccessKey, token) {
    _classCallCheck(this, AWSSigner);

    this._host = host;
    this._region = region;
    this._service = service;
    this._accessKeyId = accessKeyId;
    this._secretAccessKey = secretAccessKey;
    this._token = token;
  }

  _createClass(AWSSigner, [{
    key: 'signRoute',
    value: function signRoute(method, route, queryParameters, stringBody, signDate) {
      signDate = signDate || new Date();

      // create canonical request
      var cRequest = this.createCanonicalRequest.apply(this, arguments);
      // create string to sign
      var stringToSign = this.createStringToSign(cRequest, signDate);
      // create signature for header
      var signature = this.createSignature(stringToSign, signDate);

      // Create Headers Object
      return {
        'x-amz-date': this.getAmzLongDate(signDate),
        'Authorization': 'AWS4-HMAC-SHA256 Credential=' + this._accessKeyId + '/' + this.getAmzShortDate(signDate) + '/' + this._region + '/' + this._service + '/aws4_request, ' + ('SignedHeaders=content-type;host;x-amz-date;' + (this._token ? 'x-amz-security-token' : '') + ', Signature=' + signature),
        'x-amz-security-token': this._token || undefined,
        'host': this._host
      };
    }
  }, {
    key: 'createCanonicalRequest',
    value: function createCanonicalRequest(method, route, queryParameters, stringBody, date) {
      return method.toUpperCase() + '\n' + (route.charAt(0) !== '/' ? '/' + route : route) + '\n\ncontent-type:application/json\nhost:' + this._host + '\n' + ('x-amz-date:' + this.getAmzLongDate(date) + '\n' + (this._token ? 'x-amz-security-token:' + this._token + '\n' : '') + '\n') + ('content-type;host;x-amz-date;' + (this._token ? 'x-amz-security-token' : '') + '\n') + this.hashString(stringBody);
    }
  }, {
    key: 'createStringToSign',
    value: function createStringToSign(cRequest, date) {
      return 'AWS4-HMAC-SHA256\n' + this.getAmzLongDate(date) + '\n' + this.getAmzShortDate(date) + '/' + this._region + '/' + this._service + '/aws4_request\n' + this.hashString(cRequest);
    }
  }, {
    key: 'createSignature',
    value: function createSignature(stringToSign, date) {
      return this.hmac(this.hmac(this.hmac(this.hmac(this.hmac('AWS4' + this._secretAccessKey, this.getAmzShortDate(date)), this._region), this._service), 'aws4_request'), stringToSign).toString();
    }
  }, {
    key: 'hashString',
    value: function hashString(str) {
      return CryptoJS.SHA256(str).toString();
    }
  }, {
    key: 'hmac',
    value: function hmac(key, data) {
      return CryptoJS.HmacSHA256(data, key);
    }
  }, {
    key: 'getAmzShortDate',
    value: function getAmzShortDate(date) {
      return this.getAmzLongDate(date).substr(0, 8);
    }
  }, {
    key: 'getAmzLongDate',
    value: function getAmzLongDate(date) {
      return date.toISOString().replace(/[:\-]|\.\d{3}/g, '').substr(0, 17);
    }
  }]);

  return AWSSigner;
})();
//# sourceMappingURL=aws-client-sign.js.map
