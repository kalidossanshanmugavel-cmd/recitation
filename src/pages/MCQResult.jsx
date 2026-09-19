function MCQResult({
  studentName,
  score,
  total
}) {

  const percentage =
    Math.round(
      (score / total) * 100
    );


  const wrong =
    total - score;


  const result =
    percentage >= 50
      ? "Pass"
      : "Fail";


  return (

    <div className="mcq-result">

      <h1>
        Quiz Result
      </h1>


      <p>
        Student:{" "}
        <strong>
          {studentName}
        </strong>
      </p>


      <table>

        <tbody>

          <tr>

            <th>
              Total Questions
            </th>

            <td>
              {total}
            </td>

          </tr>


          <tr>

            <th>
              Correct Answers
            </th>

            <td>
              {score}
            </td>

          </tr>


          <tr>

            <th>
              Wrong Answers
            </th>

            <td>
              {wrong}
            </td>

          </tr>


          <tr>

            <th>
              Percentage
            </th>

            <td>
              {percentage}%
            </td>

          </tr>


          <tr>

            <th>
              Result
            </th>

            <td>
              {result}
            </td>

          </tr>

        </tbody>

      </table>


      <button
        type="button"
        onClick={
          () =>
            window.location.reload()
        }
      >

        Try Again

      </button>

    </div>

  );

}


export default MCQResult;