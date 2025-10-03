import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import {usePuterStore} from "~/lib/puter";
import {Link, useNavigate} from "react-router";
import {useEffect, useState} from "react";
import Aurora from "~/components/Aurora";
import TrueFocus from "~/components/TrueFocus";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "CVision" },
        { name: "description", content: "Smart feedback for your dream job!" },
    ];
}

export default function Home() {
    const { auth, kv } = usePuterStore();
    const navigate = useNavigate();
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loadingResumes, setLoadingResumes] = useState(false);

    useEffect(() => {
        if(!auth.isAuthenticated) navigate('/auth?next=/');
    }, [auth.isAuthenticated])

    useEffect(() => {
        const loadResumes = async () => {
            setLoadingResumes(true);

            const resumes = (await kv.list('resume:*', true)) as KVItem[];

            const parsedResumes = resumes?.map((resume) => (
                JSON.parse(resume.value) as Resume
            ))

            setResumes(parsedResumes || []);
            setLoadingResumes(false);
        }

        loadResumes()
    }, []);

    return <main >

        <div className="absolute min-h-screen inset-0 -z-0">

            <Aurora
                colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
                blend={0.5}
                amplitude={1.0}
                speed={0.5}
            />
        </div>
        <div className="relative z-10">
        <Navbar />
        <section className="main-section ">
            <div className="page-heading py-16">
                <h1>
                    <TrueFocus
                        sentence="Keep Track of Applications & AI Resume Feedback"
                        manualMode={false}
                        blurAmount={1}
                        borderColor="blue"
                        animationDuration={2}
                        pauseBetweenAnimations={1}
                    />
                    </h1>
                {!loadingResumes && resumes?.length === 0 ? (
                    <h2>No resumes found. Upload your first resume to get feedback.</h2>
                ): (
                    <h2>Review your submissions and check AI-powered feedback.</h2>
                )}
            </div>
            {loadingResumes && (
                <div className="flex flex-col items-center justify-center">
                    <img src="/images/resume-scan-2.gif" className="w-[200px]" alt={'g'} />
                </div>
            )}

            {!loadingResumes && resumes.length > 0 && (
                <div className="resumes-section">
                    {resumes.map((resume) => (
                        <ResumeCard key={resume.id} resume={resume} />
                    ))}
                </div>
            )}

            {!loadingResumes && resumes?.length === 0 && (
                <div className="flex flex-col items-center justify-center mt-10 gap-4">
                    <Link to="/upload" className="primary-button w-fit text-xl font-semibold">
                        Upload Resume
                    </Link>
                </div>
            )}
        </section>
        </div>
    </main>
}