const calculateScore = (negativeMarking, quiz, selections) => {
  let score = 0;
  let count = 0;
  Object.keys(selections).map((selection, index) => {
    if (
      selections[selection]?.toLowerCase() === quiz[index].correct.toLowerCase()
    ) {
      count = count + 1;
      score = score + 1;
    } else if (selections[selection]) score = score - negativeMarking;
  });
  return {count, score};
};

export {calculateScore};
