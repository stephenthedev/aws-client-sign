/* globals CryptoJS */
/* exported AWSSigner */

'use strict';

class AWSSigner {
  constructor(host, region, service, accessKeyId, secretAccessKey, token) {
    this._host = host;
    this._region = region;
    this._service = service;
    this._accessKeyId = accessKeyId;
    this._secretAccessKey = secretAccessKey;
    this._token = token;
  }

  signRoute(method, route, queryParameters, stringBody, signDate) {
    signDate = signDate || new Date();

    // create canonical request
    let cRequest = this.createCanonicalRequest.apply(this, arguments);
    // create string to sign
    let stringToSign = this.createStringToSign(cRequest, signDate);
    // create signature for header
    let signature = this.createSignature(stringToSign, signDate);

    // Create Headers Object
    return {
      'x-amz-date': this.getAmzLongDate(signDate),
      'Authorization': `AWS4-HMAC-SHA256 Credential=${this._accessKeyId}/${this.getAmzShortDate(signDate)}/${this._region}/${this._service}/aws4_request, ` +
        `SignedHeaders=content-type;host;x-amz-date;${this._token ? 'x-amz-security-token' : ''}, Signature=${signature}`,
      'x-amz-security-token': this._token || undefined,
      'host': this._host
    };
  }

  createCanonicalRequest(method, route, queryParameters, stringBody, date) {
    return `${method.toUpperCase()}\n${route.charAt(0) !== '/' ? '/' + route : route}\n\ncontent-type:application/json\nhost:${this._host}\n` +
      `x-amz-date:${this.getAmzLongDate(date)}\n${this._token ? 'x-amz-security-token:' + this._token + '\n' : ''}\n` +
      `content-type;host;x-amz-date;${this._token ? 'x-amz-security-token' : ''}\n` + this.hashString(stringBody);
  }

  createStringToSign(cRequest, date) {
    return `AWS4-HMAC-SHA256\n${this.getAmzLongDate(date)}\n${this.getAmzShortDate(date)}/${this._region}/${this._service}/aws4_request\n${this.hashString(cRequest)}`;
  }

  createSignature(stringToSign, date) {
    return this.hmac(
      this.hmac(
        this.hmac(
          this.hmac(
            this.hmac('AWS4' + this._secretAccessKey, this.getAmzShortDate(date)), this._region), this._service
        ), 'aws4_request'
      ), stringToSign
    ).toString();
  }

  hashString(str) {
    return CryptoJS.SHA256(str).toString();
  }

  hmac(key, data) {
    return CryptoJS.HmacSHA256(data, key);
  }

  getAmzShortDate(date) {
    return this.getAmzLongDate(date).substr(0, 8);
  }

  getAmzLongDate(date) {
    return date.toISOString().replace(/[:\-]|\.\d{3}/g, '').substr(0, 17);
  }
}
