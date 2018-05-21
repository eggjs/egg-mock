
3.17.2 / 2018-05-21
==================

**others**
  * [[`62c3dfa`](http://github.com/eggjs/egg-mock/commit/62c3dfa517b94c56c35fed8af8d9aad29e7c38d4)] - refactor: middleware use promise-based style (#74) (Haoliang Gao <<sakura9515@gmail.com>>)

3.17.1 / 2018-04-21
===================

  * fix: remove options.typescript support (#73)

3.17.0 / 2018-03-30
===================

  * feat: support ts from env and pkg (#71)

3.16.0 / 2018-03-28
===================

  * feat: support ts (#70)
  * fix: mockSession save should not be enumerable (#69)

3.15.1 / 2018-03-20
==================

**fixes**
  * [[`3fbf862`](http://github.com/eggjs/egg-mock/commit/3fbf86232ee3c8e4944c8072e127c0f1ede1d26b)] - fix: mockSession save (#68) (TZ | 天猪 <<atian25@qq.com>>)

3.15.0 / 2018-03-08
==================

**features**
  * [[`9857065`](http://github.com/eggjs/egg-mock/commit/985706518e9ab8be155f285490484e5a304833fc)] - feat: add unexpectHeader() and expectHeader() (#67) (fengmk2 <<fengmk2@gmail.com>>)
  * [[`f1820d7`](http://github.com/eggjs/egg-mock/commit/f1820d70f2e266d4b18fb7062976b4c14952a16f)] - feat: mm.app() support server event (#65) (fengmk2 <<fengmk2@gmail.com>>)

3.14.1 / 2018-02-28
==================

**fixes**
  * [[`d38d615`](http://github.com/eggjs/egg-mock/commit/d38d615c3f9bc79eb09c6864ab9d5833a50d029a)] - fix: mockUrl accepts RegExp (#64) (Brick <<brick.c.yang@gmail.com>>)

**others**
  * [[`23c1075`](http://github.com/eggjs/egg-mock/commit/23c1075f5aaaa866b0243061d0eadf21ce67d382)] - test: add post with multipart file test cases (#63) (fengmk2 <<fengmk2@gmail.com>>)

3.14.0 / 2017-12-12
==================

**others**
  * [[`be9bcd2`](http://github.com/eggjs/egg-mock/commit/be9bcd22c91044b0efdbc3db6b8109cf625002b1)] - refactor: modify d.ts and support bootstrap (Eward Song <<eward.song@gmail.com>>)

3.13.1 / 2017-10-17
==================

**fixes**
  * [[`9d071b2`](http://github.com/eggjs/egg-mock/commit/9d071b28c5ef341ee63ccb06f00f724922c698b2)] - fix: support mock the same property multiple times (#61) (Yiyu He <<dead_horse@qq.com>>)

3.13.0 / 2017-10-10
==================

**features**
  * [[`30ca0c9`](http://github.com/eggjs/egg-mock/commit/30ca0c980f3ee8b1f60f5213f0768fe5eeaaf49a)] - feat: port can be customized (#60) (Haoliang Gao <<sakura9515@gmail.com>>)

3.12.2 / 2017-09-22
==================

**fixes**
  * [[`5935564`](http://github.com/eggjs/egg-mock/commit/5935564d1e649f8702c0f3f79e67efde10717542)] - fix: missing methods package (dainli <<dainli@outlook.com>>)

**others**
  * [[`e7f518a`](http://github.com/eggjs/egg-mock/commit/e7f518a92e1686973bea557eb0a21f1d293ab0b4)] - fix(mockHttpclient): should use the copy of mockResult (#58) (Haoliang Gao <<sakura9515@gmail.com>>)
 * [new tag]         3.12.1     -> 3.12.1


3.12.1 / 2017-09-13
==================

**others**
  * [[`e7f518a`](http://github.com/eggjs/egg-mock/commit/e7f518a92e1686973bea557eb0a21f1d293ab0b4)] - fix(mockHttpclient): should use the copy of mockResult (#58) (Haoliang Gao <<sakura9515@gmail.com>>)

3.12.0 / 2017-09-12
==================

**others**
  * [[`25a0e28`](http://github.com/eggjs/egg-mock/commit/25a0e28e85209ec08a593b38cd434ed389ef8887)] - feat(mockHttpclient): use Regular Expression for matching url (#57) (Haoliang Gao <<sakura9515@gmail.com>>)

3.11.0 / 2017-09-11
==================

**features**
  * [[`f1a08a6`](http://github.com/eggjs/egg-mock/commit/f1a08a654a08313c0848828ee9051f8bf174fc6a)] - feat: support httpRequest().get(routerName) (#56) (fengmk2 <<fengmk2@gmail.com>>)

3.10.0 / 2017-08-30
==================

**features**
  * [[`f3654df`](http://github.com/eggjs/egg-mock/commit/f3654df99d4bee2ea0ee1ef580af7af66f21255d)] - feat: base promise to support async function (#55) (Yiyu He <<dead_horse@qq.com>>)

3.9.1 / 2017-08-14
==================

**fixes**
  * [[`d6cafaa`](http://github.com/eggjs/egg-mock/commit/d6cafaa531d9bbcc0fc987e7d6fdefd6a515e785)] - fix: fix agent type after ready (#54) (zōng yǔ <<gxcsoccer@users.noreply.github.com>>)

3.9.0 / 2017-08-02
==================

**features**
  * [[`9e1642c`](http://github.com/eggjs/egg-mock/commit/9e1642c7fc569d3cc4a73c9ede6511a18cca6fc5)] - feat: add bootstrap (#53) (Yiyu He <<dead-horse@users.noreply.github.com>>)

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
