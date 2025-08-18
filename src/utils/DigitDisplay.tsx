const DigitDisplay = ({ user }) => {
  const wholeNumber = Math.floor(Number(user?.commissionTotalUsd));
  const digits = String(`$${wholeNumber},00`)?.split("");

  return (
    <div className="flex flex-wrap items-center gap-[5px] sm:gap-[10px]">
      <div className="text-[15px] font-600 text-black flex gap-[5px] sm:gap-[10px] items-center">
        Your commission:{" "}
        <span>
          {" "}
          <div className="flex gap-[8px]">
            {/* {digits?.map((digit, idx) => (
              <div
                key={idx}
                className="w-[22px] h-[22px] flex items-center justify-center border border-[#4f46e5] text-[#4f46e5] text-[15px] font-bold rounded-sm"
              >
                {digit}
              </div>
            ))} */}
            <div className="odometer-container">
              {digits?.map((digit, index) => (
                <div
                  className={`${digit == "," ? "digit-wrapper-nobg" : "digit-wrapper"}`}
                  key={index}
                >
                  <div className="digit-strip">
                    <div
                      className={`${digit == "," ? "digit-nobg" : "digit"}`}
                      key={digit}
                    >
                      {digit}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </span>
      </div>
      <p className="text-[15px] font-600 text-black">
        Your level:{" "}
        <span className="font-600 text-[#4f46e5]">{user?.commissionLevel}</span>
      </p>
    </div>
  );
};

export default DigitDisplay;
