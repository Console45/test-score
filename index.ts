import { QuestionCollection, Answers, prompt } from "inquirer";

async function main() {
  console.log("Test scorer v.0.0.1");

  const removeWhiteSpaces = (text: string): string => {
    return text.replace(/\s/g, "").trim();
  };

  const questions: QuestionCollection = [
    {
      name: "correct_answers",
      message: "Input correct answers",
      validate(value: string): boolean | string {
        const trimmedValue: string = removeWhiteSpaces(value);
        if (trimmedValue.length != 30)
          return "Invalid length, length must be 30";
        const isValid: boolean = trimmedValue
          .toLowerCase()
          .split("")
          .every((answer: string) => answer == "t" || answer == "f");
        if (!isValid) return 'Answers should be only "T" or "F"';
        return true;
      },
    },
    {
      name: "student_answers",
      message: "Input student answers",
    },
  ];

  const answers: Answers = await prompt<Answers>(questions);
  const correctAnswers: string = removeWhiteSpaces(answers.correct_answers);

  let studentAnswers: Array<any> = [];

  removeWhiteSpaces(answers.student_answers)
    .match(/([0-9]+)([TFx]+)/g)!
    .forEach(answer => {
      studentAnswers.push({ [answer.substring(0, 3)]: answer.substring(3) });
    });

  for (let studentAnswer of studentAnswers) {
    let score: number = 0;

    for (let id in studentAnswer) {
      for (let i: number = 0; i < correctAnswers.length; i++) {
        if (studentAnswer[id][i] !== correctAnswers[i]) {
          if (studentAnswer[id][i] == "x") score += 0;
          else score -= 1;
        } else score += 1;
      }
    }
    for (let id in studentAnswer) {
      console.error({ [id]: score });
    }
  }
}
main();
