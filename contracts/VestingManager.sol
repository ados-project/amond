pragma solidity ^0.4.23;

import "./utils/Ownable.sol";
import "./tokens/ERC20.sol";
import "./utils/SafeMath.sol";
import "./VestingVault.sol";

contract VestingManager is Ownable {
    using SafeMath for uint256;

    // ex) 1547019753
    uint256 initialUnlockTime;

    bool public initialUnlockTimeSet = false;

    event CreateVault(address vault, address beneficiary, uint256 tokenAmount);
    ERC20 public token;

    /**
     * @param _token address of ERC20 token which this contract controls
     */
    constructor(
        address _token
    )
    public
    {
        require(_token != address(0));

        token = ERC20(_token);
    }

    modifier isSetPossible() {
        require(!initialUnlockTimeSet);
        _;
    }

    function createVault(
        address _beneficiary,
        uint256[] _tokenAmounts,
        uint256[] _unlockTimes
    )
    public onlyOwner returns (address vaultAddress) {
        require(_beneficiary != address(0));
        require(_tokenAmounts.length > 0 && _unlockTimes.length > 0);
        require(_tokenAmounts.length == _unlockTimes.length);
        require(_tokenAmounts.length <= 100);
        // Prevent block gas limit exceed
        // gas(length == 1) : 420,000gas
        // 41,000 gas per 1 length+ => set maximum length : 100

        uint256 totalAmount;
        for (uint256 i = 0; i < _tokenAmounts.length; i++) {
            totalAmount = totalAmount.add(_tokenAmounts[i]);
        }

        require(totalAmount > 0);
        require(token.balanceOf(this) >= totalAmount);


        address vestingVault = address(new VestingVault(token, _beneficiary, _tokenAmounts, _unlockTimes));
        token.transfer(vestingVault, totalAmount);

        emit CreateVault(vestingVault, _beneficiary, totalAmount);

        vaultAddress = vestingVault;
    }

    function withdraw() public onlyOwner {
        token.transfer(owner, token.balanceOf(this));
    }

    function setInitialUnlockTime(uint256 _initialUnlockTime) public onlyOwner isSetPossible {
        initialUnlockTime = _initialUnlockTime;
        initialUnlockTimeSet = true;
    }

    function getInitialUnlockTime() public returns(uint256) {
        return initialUnlockTime;
    }
}
