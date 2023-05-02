import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axiosClient from '../axios';
import PublicQuestionView from '../components/PublicQuestionView';

export default function SurveyPublicView() {
    const answers = {};
    const [surveyFinished, setSurveyFinished] = useState(false);
    const [survey, setSurvey] = useState({
        questions: []
    });
    const [loading, setLoading] = useState(false);
    const { slug } = useParams();

    useEffect(() => {
        setLoading(true);
        axiosClient.get(`/survey/get-by-slug/${slug}`)
            .then(({ data }) => {
                setSurvey(data.data)
                setLoading(false)
            }).catch(() => {
                setLoading(false)
            })
    }, []);


    function answerChanged(question, value) {
        answers[question.id] = value;
        console.log(question, value);
    }

    function onSubmit(ev) {
        ev.preventDefault();
        console.log(answers)
        axiosClient.post(`/survey/${survey.id}/answer`,
            {
                answers
            })
            .then((response) => {
                setSurveyFinished(true)
            })
    }


    return (
        <div>
            {loading && <div className="text-center text-lg">Loading</div>}
            {!loading &&
                <form onSubmit={ev => onSubmit(ev)} className='container mx-auto my-4 bg-white p-4 rounded-md'>
                    <div className='lg:flex mb-4'>
                        <div className='lg:max-w-[300px] mr-2 border border-gray-300 rounded-md overflow-hidden'>
                            <img src={survey.image_url} alt="{survey.title}" className='w-full h-auto' />
                        </div>
                        <div className='p-2'>
                            <h1 className='text-xl font-semibold mb-4'>{survey.title}</h1>
                            <p className='text-sm text-gray-500 mb-2'>{survey.expire_date}</p>
                            <p className='text-sm text-gray-500 mb-2'>{survey.description}</p>
                        </div>
                    </div>

                    {surveyFinished && (
                        <div className='py-6 px-4 bg-emerald-500 text-white w-[600px] mx-auto rounded-md text-center'>
                            Thank you for participating ind the survey
                        </div>
                    )}

                    {!surveyFinished && (
                        <>
                            <div>
                                {survey.questions.map((question, index) => (
                                    <PublicQuestionView
                                        key={index}
                                        question={question}
                                        index={index}
                                        answerChanged={val => answerChanged(question, val)}
                                    />
                                ))}
                            </div>
                            <button
                                type='submit'
                                className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                            >
                                Submit
                            </button>
                        </>
                    )}


                </form>
            }
        </div>
    )
}
