pragma solidity >=0.4.21 <0.7.0;


contract Election {
    // Model a Candidate
    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    // Read/write Candidates
    mapping(uint => Candidate) public candidates;
    // Store accounts that have voted
    mapping(address => bool) public voters;

    // Store Candidates Count
    uint256 public candidatesCount;

    constructor() public {
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
    }

    event votedEvent (
        uint indexed _candidateId
    );

    function addCandidate(string memory _name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    function vote(uint _candidateId) public {
        require(!voters[msg.sender], "Le votant a déjà voté.");

        require(_candidateId > 0 && _candidateId <= candidatesCount, "Votre candidat n'est pas valide.");

        // Nous enregistrons la personne qui vient de voter
        voters[msg.sender] = true;

        // Le nombre de vote pour le candidat séléctionné augmente de 1.
        candidates[_candidateId].voteCount++;

        emit votedEvent(_candidateId);
    }

}
