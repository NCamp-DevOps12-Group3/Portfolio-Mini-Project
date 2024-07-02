/** ------------------------------
 * 名前空間
 ------------------------------ */
// ゲームの全てを格納するグローバル変数
var GAME = GAME || {};


/** ------------------------------
 * 進行管理クラスオブジェクト
 ------------------------------ */
GAME.GameControl = (function() {
  'use strict';

  // ゲームの画面状態
  var SCREEN_STATE = {
    start  : 'start',
    restart: 'restart'
  };

  // ゲームの進行状態
  var ACTION_STATE = {
    empty: -1,
    draw :  0,
    win  :  1,
    next :  2
  };

  /* コンストラクタ */
  var that = function GameControl(options) {
    console.info('インスタンスオブジェクト生成 %cGAME.GameControl', 'color:#f30;font-weight:bold');

    /* プロパティー */
    // 設定
    this.options;
    // プレイヤー
    this.players = [];
    // プレイヤー数
    this.playerNum;
    // 現在のゲーム状態/
    this.state;
    // 終了状態
    this.actionState;
    // 何手目か
    this.turnNum;
    // 現在のプレイヤー
    this.curPlayer;
    // 勝利したプレイヤー
    this.winner;
    // カスタムイベント
    this.ev = {};

    /* DOMアクセス */
    // ゲームエリア
    this.gameEl = document.querySelector('#js-game');

    /* カスタムイベント作成 */
    // スタートボタンがクリックされたとき
    this.ev.started = document.createEvent('Event');
    this.ev.started.initEvent('gameControl.started', false, true);
    // マス目が更新されたとき
    this.ev.selected = document.createEvent('Event');
    this.ev.selected.initEvent('gameControl.selected', false, true);

    /* イベントリスナー設定 */
    // スタートボタンがクリックされたとき
    this.gameEl.addEventListener('gameControl.started', this.started.bind(this), false);
    // マス目が更新されたとき
    this.gameEl.addEventListener('gameControl.selected', this.selected.bind(this), false);

    /* プロパティー設定 */
    // ゲーム設定
    this.options = options;
    // 現在のゲーム状態
    this.setState(SCREEN_STATE.start, ACTION_STATE.empty);

    /* インスタンス生成 */
    // モーダルウィンドウインスタンスを生成
    GAME.modal = new GAME.Modal(this.state, this.actionState);
  };

  /* パブリックメソッド */
  that.prototype = {
    /**
     * scene
     * 画面を変更する
     */
    scene: function() {
      console.log('%cGAME.gamecontrol.scene():画面を変更する', 'color:#f30;');

      // モーダルウィンドウに通知
      console.info('%c通知 GAME.modal.ev.update', 'color:#f30;');
      GAME.modal.modalEl.dispatchEvent(GAME.modal.ev.update);
    },

    /**
     * started
     * ゲームスタート
     */
    started: function() {
      console.log('%cGAME.gamecontrol.started():ゲームスタートの準備', 'color:#f30;');

      // スタート時のみの処理
      if(SCREEN_STATE.start === this.state) {
        /* インスタンス生成 */
        this.createInstances();
      }

      // ゲームを始められる状態にセットする
      this.reset();

      // 現在の画面の状態、終了状態をセット
      this.setState(SCREEN_STATE.start, ACTION_STATE.next);

      // プレイヤーに通知
      for (var i = 0; i < this.playerNum; i++) {
        console.info('%c通知 this.players[' + i + '].ev.reset', 'color:#f30;');
        this.players[i].playerEl.dispatchEvent(this.players[i].ev.reset);
      }

      /* 通知 */
      // ゲームボードに通知する
      console.info('%c通知 GAME.board.ev.init', 'color:#f30;');
      GAME.board.boardEl.dispatchEvent(GAME.board.ev.init);

      // 情報エリア要素に通知する
      console.info('%c通知 GAME.info.ev.update', 'color:#f30;');
      GAME.info.infoAreaEl.dispatchEvent(GAME.info.ev.update);

      // 現在のプレイヤーインスタンスに通知する
      console.info('%c通知 GAME.players[' + this.curPlayer + '].ev.turn', 'color:#f30;');
      var curPlayer = this.players[this.curPlayer];
      curPlayer.playerEl.dispatchEvent(curPlayer.ev.turn);
    },

    /**
     * ended
     * ゲームが終了したときの後処理
     *
     * @param number resultState 終了状態
     */
    ended: function(resultState) {
      console.log('%cGAME.gamecontrol.ended():ゲームが終了したときの後処理', 'color:#f30;');

      // 現在の画面の状態、終了状態をセット
      this.setState(SCREEN_STATE.restart, resultState);

      // リスタート(結果)画面を変更する
      this.scene();
    },

    /**
     * selected
     * マス目が選択されたときの処理
     */
    selected: function() {
      console.log('%cGAME.gamecontrol.selected():マス目が選択されたときの処理', 'color:#f30;');

      // 現在のプレイヤーインスタンスに通知する
      console.info('%c通知 GAME.players[' + this.curPlayer + '].ev.add', 'color:#f30;');
      var curPlayer = this.players[this.curPlayer];
      curPlayer.playerEl.dispatchEvent(curPlayer.ev.add);

      // 次にすべき行動を決定する
      this.nextAction(curPlayer);
    },

    /**
     * reset
     * ゲームを始められる状態にする
     */
    reset: function() {
      console.log('%cGAME.gamecontrol.reset():ゲームを始められる状態にする', 'color:#f30;');

      this.turnNum     = 1;    // 何手目か
      this.curPlayer   = 0;    // 現在のプレイヤー
      this.winner      = null; // 勝利したプレイヤー
    },
    
    /**
     * setState
     * ゲームの状態をセットする
     * 
     * @param string state 現在のゲーム状態
     * @param string actionState 終了状態
     */
    setState: function(state, actionState) {
      console.log('%cGAME.gamecontrol.setState():ゲームの状態をセットする', 'color:#f30;');

      // 現在の画面の状態
      this.state       = state;
      // 終了状態
      this.actionState = actionState;
    },

    /**
     * createInstances
     * インスタンスを生成する
     */
    createInstances: function() {
      console.log('%cGAME.gamecontrol.createInstances():インスタンスを生成する', 'color:#f30;');

      // ゲームボードインスタンスを生成
      GAME.board = new GAME.Board(this.options.board.num);

      // 情報エリアクラスインスタンスを生成
      GAME.info = new GAME.Info();

      // プレイヤー数
      this.playerNum = this.options.players.length;

      // プレイヤーインスタンスを生成
      for (var i = 0; i < this.playerNum; i++) {
        this.players.push(new GAME.Player(this.options.players[i]));
      }
    },
    
    /**
     * nextAction
     * 次にすべき行動を実行する
     *
     * @param object curPlayer 現在のプレイヤー
     */
    nextAction: function(curPlayer) {
      console.log('%cGAME.gamecontrol.nextAction():次にすべき行動を実行する', 'color:#f30;');

      switch (this.checkNextAction(curPlayer)) {
        // 勝利者あり
        case ACTION_STATE.win:
          this.winner = curPlayer; // 勝利者
          this.ended(ACTION_STATE.win);
          break;
        // 引き分け 
        case ACTION_STATE.draw:
          this.ended(ACTION_STATE.draw);
          break;
        // 次のターン
        case ACTION_STATE.next:
          this.nextTurn();
          break;
      }
    },

    /**
     * checkNextAction
     * 次の行動を決定する
     *
     * @param object curPlayer 現在のプレイヤー
     * @return string 次の行動
     */
    checkNextAction: function(curPlayer) {
      console.log('%cGAME.gamecontrol.checkNextAction():次の行動を決定する', 'color:#f30;');

      var result;

      // 勝敗のつく最小ターン以下
      if (this.isNoCount(GAME.board.unitNum)) {
        result = ACTION_STATE.next;
      // 勝利者あり
      } else if(this.isWinner(curPlayer)) {
        result = ACTION_STATE.win;
      // 引き分け
      } else if (GAME.board.allUnitNum <= this.turnNum) {
        result = ACTION_STATE.draw;
      // 次のターン
      } else {
        result = ACTION_STATE.next;
      }

      return result;
    },

    /**
     * nextTurn
     * ターンを先に進める 
     */
    nextTurn: function() {
      console.log('%cGAME.gamecontrol.nextTurn():ターンを先に進める ', 'color:#f30;');

      var curPlayer;

      // プレイヤーを次に進める
      this.curPlayer = this.turnNum % this.playerNum;

      // ターン回数を更新する
      this.turnNum++;

      // 情報エリア要素に通知する 
      console.info('%c通知 GAME.info.ev.update', 'color:#f30;');
      GAME.info.infoAreaEl.dispatchEvent(GAME.info.ev.update);

      // 現在のプレイヤーインスタンスに通知する
      console.info('%c通知 GAME.players[' + this.curPlayer + '].ev.turn', 'color:#f30;');
      curPlayer = this.players[this.curPlayer];
      curPlayer.playerEl.dispatchEvent(curPlayer.ev.turn);
    },

    /**
     * isWinner
     * 現在のプレイヤーが勝利しているかどうか
     *
     * @param object curPlayer 現在のプレイヤー
     * @return boolean 勝利者かどうか
     */
    isWinner: function(curPlayer) {
      console.log('%cGAME.gamecontrol.isWinner():現在のプレイヤーが勝利しているかどうか', 'color:#f30;');

      var unitNum   = GAME.board.unitNum, // 一辺のマス目数
          selectNum = GAME.board.curSelect, // 選択されたマス目
          condition; // 選択されたマス目に紐づく勝利条件

      // 勝利条件を取得する
      condition = this.setCondition(selectNum, unitNum);
      console.log(condition);

      // 勝利条件と現在のプレイヤーの持ちマス目を比較する
      if(this.compareOwnUnitsWithConditon(condition, curPlayer.ownUnits)) {
        console.info('勝利者名: ', curPlayer.name);
        return true;
      }
      
      return false;
    },
   
    /**
     * isNoCount
     * 勝敗がつく最小ターン以下かどうか
     *
     * @param number unitNum 一辺のマス目数
     * @return boolean 最小ターン以下かどうか
     */
    isNoCount: function(unitNum) {
      console.log('%cGAME.gamecontrol.isNoCount():勝敗がつく最小ターン以下かどうか', 'color:#f30;');

      var noCount = (unitNum - 1) * this.playerNum;

      if ( noCount >= this.turnNum ) {
        console.warn('勝敗がつく最小ターン以下です');
        return true;
      }

      return false;
    },
    
    /**
     * setCondition
     * 選択したマス目から勝利条件を設定する
     *
     * @param number selected 選択されたマス目
     * @param number side 一辺のマス目数
     * @return array 勝利条件
     */
    setCondition: function(selected, side) {
      console.log('%cGAME.gameControl.setCondition():選択したマス目から勝利条件を設定する', 'color:#02940D;');

      var vertical, horizontal, slantingUp, slantingDown, result = [];

      vertical     = this.setVerticalCondition(selected, side);
      result.push(vertical);

      horizontal   = this.setHorizontalCondition(selected, side);
      result.push(horizontal);

      slantingUp   = this.setSlantingUpCondition(selected, side);
      result.push(slantingUp);

      slantingDown = this.setSlantingDownCondition(selected, side);
      result.push(slantingDown);

      return result;
    },

    /**
     * setSlantingUpCondition
     * 斜め(右上がり)の勝利条件を設定する
     *
     * @param number selected 選択されたマス目
     * @param number side 一辺のマス目数
     * @return array 勝利条件
     */
    setSlantingUpCondition: function(selected, side) {
      console.log('%cGAME.gameControl.setSlantingUpCondition():斜め(右上がり)の勝利条件を設定する', 'color:#02940D;');

      var vertical   = Math.floor(selected / side),  // 選択されたマス目の縦のインデックス
          horizontal = selected % side,              // 選択されたマス目の横のインデックス
          ind        = side - 1,                     // 一辺のもつ最大インデックス番号
          below      = ind - horizontal,             // 選択されたマス目より下の行数
          above      = ind - below,                  // 選択されたマス目より上の行数
          result     = [];

      // 該当のマス目じゃないとき
      if (vertical !== (ind - horizontal)) { return result; }

      // 選択されたマス目
      result.push(selected);

      // 選択されたマス目より下の勝利条件インデックス番号
      for (var i = 1; i <= below; i++) {
        var belowInd = selected - ((side - 1) * i);
        result.push(belowInd);
      }

      // 選択されたマス目より上の勝利条件インデックス番号
      for (var i = 1; i <= above; i++) {
        var aboveInd = selected + ((side - 1) * i);
        result.push(aboveInd);
      }

      // 勝利条件のマス目のインデックス番号を昇順にソートする
      this.sort(result);
      return result;
    },

    /**
     * setSlantingDownCondition
     * 斜め(右下がり)の勝利条件を設定する
     *
     * @param number selected 選択されたマス目
     * @param number side 一辺のマス目数
     * @return array 勝利条件
     */
    setSlantingDownCondition: function(selected, side) {
      console.log('%cGAME.gameControl.setSlantingDownCondition():斜め(右下がり)の勝利条件を設定する', 'color:#02940D;');

      var vertical   = Math.floor(selected / side), // 選択されたマス目の縦のインデックス
          horizontal = selected % side,             // 選択されたマス目の横のインデックス
          ind        = side - 1,                    // 一辺のもつ最大インデックス番号
          below      = ind - horizontal,            // 選択されたマス目より下の行数
          above      = ind - below,                 // 選択されたマス目より上の行数
          result     = [];

      // 該当のマス目じゃないとき
      if (vertical !== horizontal) { return result; }

      // 選択されたマス目
      result.push(selected);

      // 選択されたマス目より下の勝利条件インデックス番号
      for (var i = 1; i <= below; i++) {
        var belowInd = selected + ((side + 1) * i);
        result.push(belowInd);
      }

      // 選択されたマス目より上の勝利条件インデックス番号
      for (var i = 1; i <= above; i++) {
        var aboveInd = selected - ((side + 1) * i);
        result.push(aboveInd);
      }

      // 勝利条件のマス目のインデックス番号を昇順にソートする
      this.sort(result);
      return result;
    },

    /**
     * setHorizontalCondition
     * 横の勝利条件を設定する
     *
     * @param number selected 選択されたマス目
     * @param number side 一辺のマス目数
     * @return array 勝利条件
     */
    setHorizontalCondition: function(selected, side) {
      console.log('%cgamecontrol.setHorizontalCondition():横の勝利条件を設定する', 'color:#02940D;');

      var horizontal = selected % side,  // 選択されたマス目の横のインデックス
          ind        = side - 1,         // 一辺のもつ最大インデックス番号
          below      = ind - horizontal, // 選択されたマス目より下の行数
          above      = ind - below,      // 選択されたマス目より上の行数
          result     = [];

      // 選択されたマス目
      result.push(selected);

      // 選択されたマス目より下の勝利条件インデックス番号
      for (var i = 1; i <= below; i++) {
        var belowInd = selected + i;
        result.push(belowInd);
      }

      // 選択されたマス目より上の勝利条件インデックス番号
      for (var i = 1; i <= above; i++) {
        var aboveInd = selected - i;
        result.push(aboveInd);
      }

      // 勝利条件のマス目のインデックス番号を昇順にソートする
      this.sort(result);
      return result;
    },

    /**
     * setVerticalCondition
     * 縦の勝利条件を設定する
     *
     * @param number selected 選択されたマス目
     * @param number side 一辺のマス目数
     * @return array 勝利条件
     */
    setVerticalCondition: function(selected, side) {
      console.log('%cGAME.gameControl.setVerticalCondition():縦の勝利条件を設定する', 'color:#02940D;');

      var vertical = Math.floor(selected / side), // 選択されたマス目の縦のインデックス
          ind      = side - 1,                    // 一辺のもつ最大インデックス番号
          below    = ind - vertical,              // 選択されたマス目より下の行数
          above    = ind - below,                 // 選択されたマス目より上の行数
          result   = [];

      // 選択されたマス目
      result.push(selected);

      // 選択されたマス目より下の勝利条件インデックス番号
      for (var i = 1; i <= below; i++) {
        var belowInd = selected + side * i;
        result.push(belowInd);
      }

      // 選択されたマス目より上の勝利条件インデックス番号
      for (var i = 1; i <= above; i++) {
        var aboveInd = selected - side * i;
        result.push(aboveInd);
      }

      // 勝利条件のマス目のインデックス番号を昇順にソートする
      this.sort(result);
      return result;
    },

    /**
     * compareOwnUnitsWithConditon
     * 現在のプレイヤーの持ちマス目が勝利条件を満たしているか確認する
     *
     * @param array condition 勝利条件
     * @param array ownUnits 現在のプレイヤーの持ちマス目
     * @return boolean 現在のプレイヤーが勝利条件を満たしているか
     */
    compareOwnUnitsWithConditon: function(condition, ownUnits) {
      console.log('%cGAME.gameControl.compareOwnUnitsWithConditon():現在のプレイヤーの持ちマス目が勝利条件を満たしているか確認する', 'color:#02940D;');

      console.log('--------------------');
      console.log('選択したマス目による勝利条件: ', condition);
      console.log('持ちマス目: ', ownUnits);

      var cond = condition.filter(function (cond) {
        return Array.isArray(cond);
      });

      // 勝利条件のライン
      for (var i = 0, l = cond.length; i < l; i++) {
        console.log('勝利条件', i, ':', cond[i]);

        // 勝利条件の各マス目
        for (var j = 0, ll = cond[i].length; i < l; j++) {
          var result = (-1 < ownUnits.indexOf(cond[i][j]));

          // 勝利条件のマス目を持ってない
          if (!result) { break; }

          console.log('勝利条件のマス目', i, '個目: ', cond[i][j], '/ 持っているか: ', result);

          // 勝利条件のマス目を全て持っている
          // (勝利条件のマス目のループが最後まで走りきることができたら)
          if (j + 1 === ll) { return true; }
        }
      }

      return false;
    },

    /**
     * sort
     * 数値として昇順にソートする
     *
     * @param array result ソートする数値
     */
    sort: function(result) {
      console.log('%cGAME.gamecontrol.sort():数値として昇順にソートする', 'color:#02940D;');

      if (!Array.isArray(result) || !result.length) { return result; }

      result.sort(function(a, b) {
        return a - b;
      });
    }
  };

  return that;
}());


/** ------------------------------
 * プレイヤークラスオブジェクト
 ------------------------------ */
GAME.Player = (function() {
  'use strict';

  /* コンストラクタ */
  var that = function Player(player) {
    console.info('インスタンスオブジェクト生成 %cGAME.Player', 'color:#009BCA;font-weight:bold', 'プレイヤー名： ' + player.name);

    /* プロパティー */
    // 表示名
    this.name  = player.name;
    // マス目色
    this.color = player.color;
    // オートプレイ
    this.auto  = player.auto;
    // 選択したマス目
    this.ownUnits;
    // カスタムイベント
    this.ev = {};

    /* DOMアクセス */
    // プレイヤー(DOMツリーには追加しない)
    this.playerEl = document.createElement('div');

    /* カスタムイベント設定 */
    // ゲームのターンが進んだとき
    this.ev.turn = document.createEvent('Event');
    this.ev.turn.initEvent('player.turn', false, true);

    // プレイヤーがマス目を選択したとき
    this.ev.add = document.createEvent('Event');
    this.ev.add.initEvent('player.add', false, true);

    // リスタートするとき 
    this.ev.reset = document.createEvent('Event');
    this.ev.reset.initEvent('player.reset', false, true);

    /* イベント */
    // ゲームのターンが進んだとき
    this.playerEl.addEventListener('player.turn', this.turn.bind(this), false);

    // プレイヤーがマス目を選択したとき
    this.playerEl.addEventListener('player.add', this.add.bind(this), false);

    // リスタートするとき 
    this.playerEl.addEventListener('player.reset', this.reset.bind(this), false);

    // プレイデータをセットする
    //this.playerEl.dispatchEvent(this.ev.reset);
  };

  /* パブリックメソッド */
  that.prototype = {
    /**
     * turn
     * ターン毎の処理を実行する
     */
    turn: function() {
      console.log('%cGAME.player.turn():ターン毎の処理を実行する', 'color:#009BCA;');

      // ゲームボードに通知する
      console.info('%c通知 GAME.board.ev.disabled', 'color:#009BCA;');
      GAME.board.disabledEl.dispatchEvent(GAME.board.ev.disabled);

      // オートプレイヤーだったら
      if(this.isAuto()) {
        console.log(this.name + 'はオートプレイヤーです');
        // マス目を自動で選択する
        this.autoPlay();
      }
    },
   
    /**
     * isAuto
     *　 オートプレイかどうか
     *
     * @return boolean オートプレイかどうか
     */
    isAuto: function() {
      console.log('%cGAME.player.isAuto():オートプレイかどうか', 'color:#009BCA;');

      return this.auto;
    },
    
    /**
     * add
     *　現在のプレイヤーが選択したマス目を追加する
     */
    add: function() {
      console.log('%cGAME.player.add():現在のプレイヤーが選択したマス目を追加する', 'color:#009BCA;');

      // 追加
      this.ownUnits.push(GAME.board.curSelect);

      // 昇順でソートする
      this.ownUnits.sort(function(a, b) {
        return a - b;
      });
    },
    
    /**
     * reset
     *　 プレイデータをリセットする
     */
    reset: function() {
      console.log('%cGAME.player.reset():プレイヤーデータをリセットする', 'color:#009BCA;');

      this.ownUnits = [];
    },
  
    /**
     * autoPlay
     * マス目を自動で選択する
     */
    autoPlay: function() {
      console.log('%cGAME.player.autoPlay():マス目を自動で選択する', 'color:#009BCA;');

      var canPutArr = this.getCanPut(),
          random    = Math.floor(Math.random() * canPutArr.length),
          selectInd = canPutArr[random],
          SECONDS   = 1000,
          min       = 0.5 * SECONDS,
          max       = 2.5 * SECONDS,
          thinking  = Math.ceil(Math.random() * (max - min) + min);

      console.log('オートプレイヤー思考時間: ', thinking + 'ms');

      // 考えてる風な演出
      setTimeout(function() {
        console.info('%c通知 GAME.board.ev.autoClick', 'color:#009BCA;');
        GAME.board.unitsEls[selectInd].dispatchEvent(GAME.board.ev.autoClick);
      }, thinking);
    },

    /**
     * getCanPut
     * まだ選択されていないマス目リストを取得する
     * 
     * @return array まだ選択されていないマス目リスト
     */
    getCanPut: function() {
      console.log('%cGAME.player.getCanPut():まだ選択されていないマス目リストを取得する', 'color:#009BCA;');

      var canPutArr = GAME.board.allUnitsArray.filter(function(el, ind, arr) {
        return -1 === GAME.board.selectedNum.indexOf(arr[ind]);
      });
      return canPutArr;
    }
  };

  return that;
}());


/** ------------------------------
 * ゲームボードクラスオブジェクト
 ------------------------------ */
GAME.Board = (function() {
  'use strict';

  // マス目要素の識別子
  var UNIT_PREFIX = 'data-board-unit';

  // マス目選択不可状態時の表示テキスト 
  var DISABLED_STR = {
      thinking: 'が考え中です…'
  };

  /* コンストラクタ */
  var that = function Board(unitNum) {
    console.info('インスタンスオブジェクト生成 %cGAME.Board','color:#A07600;font-weight:bold');

    /* プロパティー */
    // 各辺のマス目数(何目並べか)
    this.unitNum       = unitNum,
    // 全マス目数
    this.allUnitNum    = Math.pow(this.unitNum, 2);
    // 全マス目の配列
    this.allUnitsArray = this.createAllUnitsArray();
    // 選択済みのマス目
    this.selectedNum;
    // 現在選択されたマス目
    this.curSelect;
    // カスタムイベント
    this.ev = {};

    /* DOMアクセス */
    // ゲームボード
    this.boardEl    = document.querySelector('#js-board');
    // マス目を選択不可にする
    this.disabledEl = document.querySelector('#js-disabled');
    // マス目を選択不可にする
    this.infoEl     = document.querySelector('#js-disabled-info');
    // マス目 
    this.unitsEls;

    /* カスタムイベント設定 */
    // ゲームがスタートされたとき
    this.ev.init = document.createEvent('Event');
    this.ev.init.initEvent('board.init', false, true);
    // マス目が選択されたとき
    this.ev.autoClick = document.createEvent('Event');
    this.ev.autoClick.initEvent('click', false, true);
    // ゲームのターンが進んだとき
    this.ev.disabled = document.createEvent('Event');
    this.ev.disabled.initEvent('board.disabled', false, true);

    /* イベント */
    // ゲームがスタートされたとき
    this.boardEl.addEventListener('board.init', this.init.bind(this), false);
    // ゲームのターンが進んだとき
    this.disabledEl.addEventListener('board.disabled', this.toggleDisabled.bind(this), false);
  };

  /* パブリックメソッド */
  that.prototype = {
    /**
     * init
     * ゲームボードの準備をする
     */
    init: function() {
      console.log('%cGAME.board.init():ゲームボードの準備をする', 'color:#A07600;');

      // ゲームボードの状態をリセットする
      this.reset();

      // ゲームボードを作成する
      this.create();
    },

    /**
     * reset
     * ゲームを始められる状態にする
     */
    reset: function() {
      console.log('%cGAME.board.reset():ゲームを始められる状態にする', 'color:#A07600;');

      // マス目
      if (this.unitsEls) {
        for (var i = 0, l = this.unitsEls.length; i < l; i++) {
          this.update(this.unitsEls[i], ''); // 選択済みのマス目の色をリセット
        }
      }

      this.selectedNum = []; // 選択済みのマス目リスト
      this.curSelect   = ''; // 最後に選択されたマス目情報
    },
    
    /**
     * create
     * ゲームボードを作成する
     *
     * @param string UNIT_PREFIX data属性のプレフィックス
     */
    create: function() {
      console.log('%cGAME.board.create():ゲームボードを作成する', 'color:#A07600;');

      if (this.unitsEls) { return; }

      // 仮の空ノード
      var docfrg = document.createDocumentFragment();

      // マス目をつくる
      for (var i = 0; i < this.allUnitNum; i++) {
        var unit = document.createElement('div'); // マス目要素
        unit.setAttribute(UNIT_PREFIX, i); // data属性セット
        docfrg.appendChild(unit); // マス目を仮の空ノードに追加

        // 列の右端で回り込み解除
        if (0 !== i && 0 === i % this.unitNum) {
          unit.style.clear = 'left';
        }
      }

      // マス目をゲームボードに追加
      this.boardEl.appendChild(docfrg);

      // マス目要素
      this.unitsEls = document.querySelectorAll('#js-board > *');

      // マス目
      for (var i = 0, l = this.unitsEls.length; i < l; i++) {
        // マス目が選択されたとき
        this.unitsEls[i].addEventListener('click', this.selected.bind(this), false);
      }
    },

    /**
     * selected
     * マス目が選択されたときの処理を実行する
     *
     * @param object e イベントオブジェクト
     */
    selected: function(e) {
      console.log('%cGAME.board.selected():マス目が選択されたときの処理を実行する', 'color:#A07600;');

      var unitEl = e.target,
          ind    = parseInt( unitEl.getAttribute(UNIT_PREFIX), 10),
          color;

      // 既に選択されていたら何もしない
      if (this.isSelected(ind)) { return; }

      // 選択されたマス目
      this.curSelect = ind;

      // 選択済みマス目リストに選択されたマス目番号を追加する
      this.add(ind);

      // マス目の表示を更新する
      color = GAME.gameControl.players[GAME.gameControl.curPlayer].color;
      this.update(unitEl, color);

      // ゲーム進行管理に通知
      console.info('%c通知 GAME.gameControl.ev.selected','color:#A07600;font-weight:bold');
      GAME.gameControl.gameEl.dispatchEvent(GAME.gameControl.ev.selected);
    },

    /**
     * add
     * 選択済みマス目リストに選択されたマス目番号を追加する
     *
     * @param number ind 選択されたマス目番号
     */
    add: function(ind) {
      console.log('%cGAME.board.add():選択済みマス目リストに選択されたマス目番号を追加する', 'color:#A07600;');

      this.selectedNum.push(ind);
    },
    
    /**
     * isSelected
     * マス目が既に選択されているかどうか
     *
     * @param string ind マス目のインデックス番号
     * @return boolean マス目が既に選択されているか
     */
    isSelected: function(ind) {
      console.log('%cGAME.board.isSelected():マス目が既に選択されているかどうか', 'color:#A07600;');

      return this.selectedNum.indexOf(ind) > -1;
    },

    /**
     * update
     * マス目の表示を更新する
     *
     * @param object el マス目要素
     * @param string color 色
     */
    update: function(el, color) {
      console.log('%cGAME.board.update():マス目の表示を更新する', 'color:#A07600;');

      el.style.backgroundColor = color;
    },
    
    /**
     * createAllUnitsArray
     * 全マス目リストを作成する
     *
     * @return array 全マス目リスト
     */
    createAllUnitsArray: function() {
      console.log('%cGAME.board.createAllUnitsArray():全マス目リストを作成する', 'color:#A07600;');

      var allUnitsArray = [];

      for (var i = 0, l = this.allUnitNum; i < l; i++) {
        allUnitsArray[i] = i;
      }

      return allUnitsArray;
    },
    
    /**
     * toggleDisabled
     * マス目を選択可・不可にする
     */
    toggleDisabled: function() {
      console.log('%cGAME.board.toggleDisabled():マス目を選択可・不可にする', 'color:#A07600;');

      var curPlayer = GAME.gameControl.players[GAME.gameControl.curPlayer],
          auto      = curPlayer.isAuto(),
          display   = '';

      if (auto) {
        display = 'block';
        // コンテンツを作成する
        this.createAutoPlayContent(curPlayer.name + DISABLED_STR.thinking);
      } else {
        display = 'none';
      }

      // 表示変更
      this.disabledEl.style.display = display;
    },

    /**
     * createAutoPlayContent
     * 表示コンテンツを作成する
     * 
     * @param string content 表示内容
     */
    createAutoPlayContent: function(content) {
      console.log('%cGAME.board.createAutoPlayContent():表示コンテンツを作成する', 'color:#A07600;');

      this.infoEl.innerHTML = content || '';
    }
  };

  return that;
}());


/** ------------------------------
 * モーダルウィンドウクラスオブジェクト
 ------------------------------ */
GAME.Modal = (function() {
  'use strict';

  // モーダルウィンドウの状態別表示テキスト 
  var MODAL_STR = {
    start: {
      info: 'ゲームをスタート!',
      btn : 'スタート'
    },
    restart: {
      result: ['引き分け！<br>', 'の勝ち!<br>'],
      info  : 'ゲームをリスタート!',
      btn   : 'リスタート'
    }
  };

  /* コンストラクタ */
  var that = function Modal() {
    console.info('インスタンスオブジェクト生成 %cGAME.Modal', 'color:#6A02B9;font-weight:bold');

    /* プロパティー */
    // カスタムイベント
    this.ev = {};

    /* DOMアクセス */
    // スタート画面(モーダルウィンドウ全体)
    this.modalEl = document.querySelector('#js-modal');
    // コンテンツ(モーダルウィンドウに表示するテキストコンテンツ)
    this.infoEl  = document.querySelector('#js-modal-info');
    // スタートボタン(モーダルウィンドウに表示するボタン)
    this.btnEl   = document.querySelector('#js-modal-btn');

    /* カスタムイベント設定 */
    // モーダルウィンドウ内表示を更新するとき
    this.ev.update = document.createEvent('Event');
    this.ev.update.initEvent('modal.update', false, true);
    // 画面が変更されるとき
    //this.ev.toggle = document.createEvent('Event');
    //this.ev.toggle.initEvent('modal.toggle', false, true);

    /* イベント */
    // モーダルウィンドウ内表示を更新するとき
    this.modalEl.addEventListener('modal.update', this.update.bind(this), false);
    // ボタンがクリックされたとき(通知)
    this.btnEl.addEventListener('click', this.notification, false);
    // ボタンがクリックされたとき(非表示)
    this.btnEl.addEventListener('click', this.toggleDisplay.bind(this), false);
    // 画面が変更されるとき
    //this.btnEl.addEventListener('modal.toggle', this.toggleDisplay.bind(this), false);
  };

  /* パブリックメソッド */
  that.prototype = {
    /**
     * update
     * モーダルウィンドウ内の表示を更新する
     */
    update: function() {
      console.log('%cGAME.modal.update():モーダルウィンドウ内の表示を更新する', 'color:#6A02B9;');

      // 表示コンテンツを作成する
      this.createContent(GAME.gameControl.state, GAME.gameControl.actionState);
      this.toggleDisplay();
    },
    
    /**
     * createContent
     * 表示コンテンツを作成する
     * 
     * @param string state ゲーム画面の状態
     * @param number actionState ゲーム結果状況
     */
    createContent: function(state, actionState) {
      console.log('%cGAME.modal.createContent():表示コンテンツを作成する', 'color:#6A02B9;');

      var stateObj   = MODAL_STR[state],
          winnerName = '',
          result     = '';

      if ('restart' === state) {
        winnerName = GAME.gameControl.winner ? GAME.gameControl.winner.name : '';
        result = winnerName + stateObj['result'][actionState];
      }

      this.infoEl.innerHTML = result + '<br>' + stateObj['info'];
      this.btnEl.innerHTML  = stateObj['btn'];
    },

    /**
     * notification
     * ゲームスタートを通知する
     */
    notification: function() {
      console.log('%cGAME.modal.notification():ゲームスタートを通知する', 'color:#6A02B9;');

      // 進行管理に通知
      console.info('%c通知 GAME.gameControl.ev.started', 'color:#6A02B9;');
      GAME.gameControl.gameEl.dispatchEvent(GAME.gameControl.ev.started);
    },
    
    /**
     * toggleDisplay
     * モーダルウィンドウ表示・非表示切り替え
     */
    toggleDisplay: function() {
      console.log('%cGAME.modal.toggleDisplay():モーダルウィンドウ表示・非表示切り替え', 'color:#6A02B9;');

      if ('' === this.modalEl.style.display || 'none' === this.modalEl.style.display) {
        this.modalEl.style.display = 'block';
      } else {
        this.modalEl.style.display = 'none';
      }
    }
  };

  return that;
}());


/** ------------------------------
 * 情報エリアクラスオブジェクト
 ------------------------------ */
GAME.Info = (function() {
  'use strict';

  // 表示するプレイヤー名のあとにつける文字
  var TURN_STR = 'さんのターン';

  /* コンストラクタ */
  var that = function Info() {
    console.info('インスタンスオブジェクト生成 %cGAME.Info', 'color:#D697A3;font-weight:bold');

    /* プロパティー */
    // カスタムイベント
    this.ev = {};

    /* DOMアクセス */
    // 情報エリア
    this.infoAreaEl = document.querySelector('#js-infoarea');

    /* カスタムイベント設定 */
    // ゲームのターンが進んだとき
    this.ev.update  = document.createEvent('Event');
    this.ev.update.initEvent('info.update', false, true);

    /* イベント */
    // ゲームのターンが進んだとき
    this.infoAreaEl.addEventListener('info.update', this.update.bind(this), false);
  };

  /* パブリックメソッド */
  that.prototype = {
    /*
     * update
     * 情報エリア内の表示を更新する
     */
    update: function() {
      console.log('%cGAME.info.update():情報エリア内の表示を更新する', 'color:#D697A3;');

      // 表示更新
      var name = GAME.gameControl.players[GAME.gameControl.curPlayer].name;
      this.infoAreaEl.innerHTML = name + TURN_STR;
    }
  };

  return that;
}());


/** ------------------------------
 * 実行
 ------------------------------ */
document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // ゲームの設定
  var options = {
    board: {
      num: 3 // 何目並べか
    },
    players: [{
      name : 'プレイヤー1', // プレイヤー表示名
      color: '#d43c32', // マス目の色
      auto : false       // オートプレイかどうか
    }
    , {
      name : 'プレイヤー2',
      color: '#decd04',
      auto : true
    }
    //, {
    //  name : 'プレイヤー3',
    //  color: '#de9b04',
    //  auto : true
    //}
    ]
  };

  console.table(options.players);
  // ゲーム実行開始
  GAME.gameControl = new GAME.GameControl(options);
  // スタート画面表示
  GAME.gameControl.scene();

}, false);