
3.8.0 / 2017-06-21
==================

  * deps: upgrade dependencies (#51)
  * test: disable coverage when mm.cluster (#50)

3.7.2 / 2017-06-07
==================

  * fix(httpclient): miss headers on options when emit response (#49)

3.7.1 / 2017-06-01
==================

  * fix: detect prop object type can be non string (#48)

3.7.0 / 2017-05-18
===================

  * feat: support prerequire files (#46)

3.6.1 / 2017-05-11
==================

  * fix: ignore all error on cluster mock restore (#45)

3.6.0 / 2017-05-10
==================

  * chore: add tsd (#43)
  * feat: support mock function on cluster mode (#44)
  * deps: upgrade dependencies (#42)

3.5.0 / 2017-04-25
==================

  * feat: mockUrllib support async function (#41)

3.4.0 / 2017-04-17
==================

  * feat: should pass when emit egg-ready (#39)

3.3.0 / 2017-04-15
==================

  * feat: add app.httpRequest() test helper (#38)

3.2.0 / 2017-03-14
==================

  * feat: mockHttpClient support mock multi methods (#35)
  * test: remove userrole (#34)

3.1.2 / 2017-03-05
==================

  * fix: should pass all arguments when mockCookies (#33)

3.1.1 / 2017-03-04
==================

  * fix: egg-mock is not a framework (#32)

3.1.0 / 2017-03-02
==================

  * feat: use framework instead of customEgg (#31)

3.0.1 / 2017-02-22
==================

  * fix: app.close in right order (#30)

3.0.0 / 2017-02-13
==================

  * deps: upgrade egg (#29)
  * fix: bind messenger with app and agent (#28)
  * feat: [BREAKING_CHANGE] can get error from .ready() (#27)
  * test: remove unuse codes (#26)

2.4.0 / 2017-02-08
==================

  * feat: listen error that thrown when app init (#25)

2.3.1 / 2017-01-26
==================

  * fix: improve proxy handler and event listener (#24)

2.3.0 / 2017-01-25
==================

  * feat: cluster-client support for mm.app (#23)

2.2.0 / 2017-01-25
==================

  * feat: reimplement mm.app (#22)

2.1.0 / 2017-01-16
==================

  * feat: support read framework from package.json (#20)

2.0.0 / 2017-01-12
==================

  * refactor: use mockHttpclient instead of mockUrllib (#19)

1.3.0 (deprecated) / 2017-01-12
==================

  * refactor: use mockHttpclient instead of mockUrllib (#19)

1.2.1 / 2017-01-09
==================

  * fix: can't override data when mockContext(data) (#18)
  * fix: replace the internal link into an github link in the env comment. (#17)

1.2.0 / 2016-11-11
==================

  * feat: try to lookup egg that will be the default customEgg (#16)
  * fix: don't use cache when app from cache is closed (#15)

1.1.0 / 2016-11-02
==================

  * feat: add mm.home (#14)

1.0.0 / 2016-11-01
==================

  * test: add testcase (#10)

0.0.8 / 2016-10-25
==================

  * feat: wait 10ms to close app (#13)

0.0.7 / 2016-10-25
==================

  * feat: should close agent when app close (#12)

0.0.6 / 2016-10-24
==================

  * feat: cluster should wait process exit (#11)
  * docs:update readme (#9)
  * docs: update readme

0.0.5 / 2016-10-11
==================

  * feat: pass opt to coffee (#7)

0.0.4 / 2016-08-16
==================

  * fix: add eggPath for new egg (#5)
