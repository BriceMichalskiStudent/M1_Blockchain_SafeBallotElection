const App = {
  web3Provider: null,
  contracts: {},
  account: '',
  web3: {},

  logInit: function () {
    // $('form').show();
    $('#election').hide();
    $('#result').hide();
    $('#login').show();
  },
  signup: function () {
    const password = $('#choosePassword').get()[0].value
    const accountGenerated = web3.personal.newAccount(password);
    const unlocked = web3.personal.unlockAccount(accountGenerated, password, 10000);

    if (unlocked) {
      App.account = accountGenerated;

      web3.eth.getCoinbase(function (err, coinBase) {
        if (err === null) {
          // Given amount of ether for start
          web3.eth.sendTransaction({
            from: coinBase,
            to: accountGenerated,
            value: web3.toWei(1, "ether")
          });

          $("#accountAddress").html("Your Account: " + accountGenerated);
          $('#election').show();
          $('#result').show();
          $('#login').hide()
          App.render();
        }
      });


    }

  },
  login: function () {
    $('#loginError').hide()
    const addr = $('#loginAdress').get()[0].value
    const password = $('#loginPassword').get()[0].value

    try {
      const loginResult = web3.personal.unlockAccount(addr, password);

      if (loginResult) {
        App.account = addr;
        $("#accountAddress").html("Your Account: " + addr);
        $('#election').show();
        $('#result').show();
        $('#login').hide()
      } else {
        $('#loginError').show()
      }
    } catch {
      $('#loginError').show()
    }

  },
  init: function () {
    return App.initWeb3();
  },
  initWeb3: function () {
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
      web3 = new Web3(App.web3Provider);
      App.web3 = web3;
    }
    return App.initContract();
  },
  initContract: function () {
    $.getJSON("Election.json", function (election) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Election = TruffleContract(election);
      // Connect provider to interact with contract
      App.contracts.Election.setProvider(App.web3Provider);

      App.listenForEvents();

      return App.render();
    });
  },
  render: function () {
    let electionInstance;
    const loader = $("#loader");
    const content = $("#content");

    loader.show();
    content.hide();

    // Load contract data
    App.contracts.Election.deployed().then(function (instance) {
      electionInstance = instance;
      return electionInstance.candidatesCount();
    }).then(function (candidatesCount) {
      const candidateResult = document.getElementById("candidatesResults");
      candidateResult.innerHTML = "";  
      const candidatesSelect = document.getElementById("candidatesSelect");
      candidatesSelect.innerHTML = "";

      for (let i = 1; i <= candidatesCount; i++) {
        electionInstance.candidates(i).then(function (candidate) {
          const id = candidate[0];
          const name = candidate[1];
          const voteCount = candidate[2];

          // Render candidate Result
          const candidateTemplate = `<tr><th>${id}</th><td>${name}</td><td>${voteCount}</td></tr>`.trim();
          candidatesResults.innerHTML += candidateTemplate;

          // Render candidate ballot option
          var candidateOption = `<div class="col-lg-4"><div class="item">
            <input id="answer_${id}" type="radio" name="branch_1_group_1" value="${id}" class="required">
            <label for="answer_${id}"><img src="images/president.svg" alt=""><strong>${name}</strong></label>
            </div></div>`.trim();
          candidatesSelect.innerHTML += candidateOption;
        });
      }
      return electionInstance.voters(App.account);
    }).then(function (hasVoted) {
      // Do not allow a user to vote
      if (hasVoted) {
        $('form').hide();
      } else {
        $('form').show();
      }
      loader.hide();
      content.show();
    }).catch(function (error) {
      console.warn(error);
    });
  },
  castVote: function () {
    const candidateId = $('input:checked').val();
    App.contracts.Election.deployed().then(function (instance) {
      return instance.vote(candidateId, {
        from: App.account
      });
    }).then(function (result) {
      // Wait for votes to update
      App.render();
    }).catch(function (err) {
      console.error(err);
    });
  },
  listenForEvents: function () {
    App.contracts.Election.deployed().then(function (instance) {
      instance.votedEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function (error, event) {
        // Reload when a new vote is recorded
  
      });
    });
  }
};

$(function () {
  $(window).load(function () {
    App.init();
    App.logInit();
    $('#loginError').hide()
    document.getElementById('signup-button').addEventListener('click', App.signup);
    document.getElementById("login-button").addEventListener('click', App.login);

    document.getElementById("logout").addEventListener('click', () => {
      App.logInit();
      $(".cd-nav-trigger").click();
    });

  });
});