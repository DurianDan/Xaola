const approxDaysIndicators: [string, number][] = [
  ['month', 30],
  ['hour', 1 / 24],
  ['week', 7],
  ['day', 1],
  ['year', 365.5],
  ['minute', 1 / (60 * 24)],
  ['about', 0.9],
  ['almost', 0.75],
  ['over', 1.2],
];

function isPhoneNumber(checkStr: string): boolean {
  // Use a regular expression to match common phone number patterns
  const phoneNumberRegex = /^\+?[0-9\s-]+$/;

  // Test if the string matches the regular expression
  return phoneNumberRegex.test(checkStr);
}

function getApproxDaysFromPeriodIndicatorString(
  periodIndicator: string | undefined,
): undefined | number {
  if (periodIndicator) {
    let rawPeriod = Number(periodIndicator.match(/\d+/g) ?? [0]);
    for (const [approxIndicator, conversionRate] of approxDaysIndicators) {
      if (periodIndicator.includes(approxIndicator)) {
        rawPeriod *= conversionRate;
      }
    }
    return rawPeriod;
  } else {
    return undefined;
  }
}

export { isPhoneNumber, getApproxDaysFromPeriodIndicatorString };
