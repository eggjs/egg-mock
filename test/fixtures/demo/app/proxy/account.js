'use strict';

module.exports = function (app) {
  const serviceId = 'com.alipay.personalproxy.service.acctrans.AccountQuery:1.0';
  const consumer = app.hsfClient.createConsumer({
    id: serviceId,
    group: 'SOFA',
    appname: 'personalproxy',
  });

  class AccountQuery extends app.Proxy {
    constructor(ctx) {
      super(ctx, consumer);
    }
    // public abstract com.alipay.acctrans.core.model.vo.AccountInfo getAccountInfo(java.lang.String);
    * getAccountInfo(a) {
      const args = [
        {
          $class: 'java.lang.String',
          $: a
        },
      ];
      return yield* consumer.invokeNew(this.ctx, 'getAccountInfo', args);
    }

    * getAccountInfo2(a) {
      const args = [
        {
          $class: 'java.lang.String',
          $: a
        },
      ];
      return yield* consumer.invokeNew(this.ctx, 'getAccountInfo2', args);
    }
  }

  return AccountQuery;
};
