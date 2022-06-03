const calculateScore = (negativeMarking, quiz, selections) => {
  let score = 0;
  let count = 0;
  let incorrect = 0;
  quiz = quiz.filter(q => q && q !== 'null');
  Object.keys(selections).forEach(selection => {
    if (isNaN(Number(selection)) || selections[selection] === '') {
      delete selections[selection];
    }
  });
  Object.keys(selections).map((selection, index) => {
    if (
      selections[selection]?.toLowerCase() === quiz[index].correct.toLowerCase()
    ) {
      count = count + 1;
      score = score + 1;
    } else if (selections[selection]) {
      score = score - negativeMarking;
      incorrect = incorrect + 1;
    }
  });
  return {count, incorrect, score};
};

export {calculateScore};
