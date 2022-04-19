const calculateScore = (negativeMarking, quiz, selections) => {
  let score = 0;
  Object.keys(selections).map((selection, index) => {
    if (
      selections[selection]?.toLowerCase() === quiz[index].correct.toLowerCase()
    ) {
      score = score + 1;
    } else if (selections[selection]) score = score - negativeMarking;
  });
  return score;
};

export {calculateScore};
