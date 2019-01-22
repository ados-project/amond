pragma solidity ^0.4.23;

import "./tokens/ERC20.sol";
import "./utils/SafeMath.sol";
import "./VestingManager.sol";

contract VestingVault {
    using SafeMath for uint256;

    event Released(uint256 amount);

    // beneficiary of tokens after they are released
    ERC20 public token;
    address public beneficiary;

    VestingManager public vestingManager;

    uint256[] public tokenAmounts;
    uint256[] public unlockTimes;

    uint256 public released;

    /**
     * @dev Creates a vesting contract that vests its balance of any ERC20 token to the
     * _beneficiary, gradually in a linear fashion until _start + _duration. By then all
     * of the balance will have vested.
     * @param _token address of ERC20 token which this contract controls
     * @param _beneficiary address of the beneficiary to whom vested tokens are transferred
     */
    constructor(
        address _token,
        address _beneficiary,
        uint256[] _tokenAmounts,
        uint256[] _unlockTimes
    )
    public
    {
        require(_token != address(0));
        require(_beneficiary != address(0));
        require(_tokenAmounts.length > 0 && _unlockTimes.length > 0);
        require(_tokenAmounts.length == _unlockTimes.length);

        vestingManager = VestingManager(msg.sender);

        token = ERC20(_token);
        beneficiary = _beneficiary;
        tokenAmounts = _tokenAmounts;
        unlockTimes = _unlockTimes;
    }

    /**
     * @notice Transfers vested tokens to beneficiary.
     */
    function release() public {
        require(tokenAmounts.length > 0);
        uint256 initialUnlockTime = vestingManager.getInitialUnlockTime();
        require(initialUnlockTime > 0);

        uint256 totalAmount;
        for (uint256 i = 0; i < tokenAmounts.length; i++) {
            if (block.timestamp >= initialUnlockTime.add(unlockTimes[i])) {
                totalAmount = totalAmount.add(tokenAmounts[i]);
                tokenAmounts[i] = 0;
            }
        }
        require(totalAmount > 0);

        token.transfer(beneficiary, totalAmount);
        released = released.add(totalAmount);
        emit Released(totalAmount);
    }

    /**
     * @dev Calculates the amount that has already vested but hasn't been released yet.
     */
    function releasableAmount() public view returns (uint256) {
        uint256 totalAmount;
        uint256 initialUnlockTime = vestingManager.getInitialUnlockTime();

        if (initialUnlockTime == 0) {
            totalAmount = 0;
        } else {
            for (uint256 i = 0; i < tokenAmounts.length; i++) {
                if (block.timestamp >= initialUnlockTime.add(unlockTimes[i])) {
                    totalAmount = totalAmount.add(tokenAmounts[i]);
                }
            }
        }

        return totalAmount;
    }

    /**
     * @dev Calculates the amount that has already vested.
     */
    function vestedAmount() public view returns (uint256) {
        return releasableAmount().add(released);
    }
}
