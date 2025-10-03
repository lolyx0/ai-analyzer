import ScoreGauge from "~/components/ScoreGauge";
import ScoreBadge from "~/components/ScoreBadge";

const Category = ({ title, score }: { title: string; score: number }) => {
    const textColor =
        score > 70 ? "text-green-600" : score > 49 ? "text-yellow-600" : "text-red-600";

    return (
        <div className="resume-summary">
            <div className="category">
                <div className="flex flex-row gap-2 items-center justify-center">
                    <p className="text-2xl">{title}</p>
                    <ScoreBadge score={score} />
                </div>
                <p className="text-2xl">
                    <span className={textColor}>{score}</span>/100
                </p>
            </div>
        </div>
    );
};

const Summary = ({ feedback }: { feedback: Feedback }) => {
    // Provide defaults
    const safeFeedback = {
        overallScore: feedback?.overallScore ?? 0,
        toneAndStyle: feedback?.toneAndStyle ?? { score: 0, tips: [] },
        content: feedback?.content ?? { score: 0, tips: [] },
        structure: feedback?.structure ?? { score: 0, tips: [] },
        skills: feedback?.skills ?? { score: 0, tips: [] },
    };

    return (
        <div className="bg-white rounded-2xl shadow-md w-full">
            <div className="flex flex-row items-center p-4 gap-8">
                <ScoreGauge score={safeFeedback.overallScore} />
                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-bold">Your Resume Score</h2>
                    <p className="text-sm text-gray-500">
                        This score is calculated based on the variables listed below.
                    </p>
                </div>
            </div>

            <Category title="Tone & Style" score={safeFeedback.toneAndStyle.score} />
            <Category title="Content" score={safeFeedback.content.score} />
            <Category title="Structure" score={safeFeedback.structure.score} />
            <Category title="Skills" score={safeFeedback.skills.score} />
        </div>
    );
};

export default Summary;
