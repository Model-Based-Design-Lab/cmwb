import React from "react"

export default function QuizMessage(quiz: any) {
    var el: JSX.Element
    // TODO: something fishy about quiz.quiz.active...
    if (quiz && quiz.quiz.active) {
        el = <p>This session is part of a quiz.</p>
    } else {
        el = <p></p>
    }

    return el
}

