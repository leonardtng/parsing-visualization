<div className="onboarding-claim-dust w-full h-full absolute top-0 right-0 flex justify-end items-center pr-3">
{claimStatus && (
  <>
    {claimStatus?.status === ClaimStatusType.PENDING ? (
      <Button
        text
        className="w-[40px] h-8 md:h-[40px] flex justify-center items-center text-fontPrimary font-bold uppercase text-xs mr-3"
        onClick={retryClaim}
      >
        <span>retry</span>
      </Button>
    ) : (
      claimStatus?.status === ClaimStatusType.CONFIRMING && (
        <Button
          text
          className="w-5 h-5 flex justify-center items-center mr-3"
          onClick={() =>
            window.open(
              `${EXPLORER_URL}/tx/${claimStatus?.issuanceTxnHash}`,
              "_blank",
              "noopener noreferrer"
            )
          }
        >
          <EtherscanIcon className="first:[&_path]:fill-white last:[&_path]:fill-[#8b8b8b]" />
        </Button>
      )
    )}
    <Button
      className="w-[105px] h-8 md:h-[40px] flex justify-center items-center border-2 border-fontPrimary text-fontPrimary font-bold uppercase disabled:opacity-50"
      onClick={handleOpenClaimModal}
      disabled={
        tourState.isOnboarding ||
        unclaimedRewards === 0 ||
        !claimComplete
      }
    >
      {!claimComplete ? (
        <>
          <CircularProgress className="first:[&_path]:fill-none fill-fontPrimary" />
          <span className="text-[10px] ml-[6px]">
            {claimStatus?.status === ClaimStatusType.PENDING
              ? "pending"
              : "confirming"}
          </span>
        </>
      ) : (
        <span>claim</span>
      )}
    </Button>
    {!claimComplete && (
      <span className="absolute bottom-1 -mb-[2px] text-[7.5px] min-w-[105px] text-center text-fontSecondary whitespace-nowrap">
        {claimStatus.issuanceTxnPayload.details.length > 1 ? "Claiming rewards" : claimStatus.issuanceTxnPayload.details[0].prizeType === 0 ? Number(
          claimStatus.issuanceTxnPayload.details[0].tokenIdOrAmount
        ) / 1000000000) : `NFT #${claimStatus.issuanceTxnPayload.details[0].tokenIdOrAmount}`}
        &nbsp;
        {PRIMARY_REWARD}&nbsp; to&nbsp;
        {shortenAddress(claimStatus.issuanceTxnPayload.recipient, 4)}
      </span>
    )}
  </>
)}
</div>
