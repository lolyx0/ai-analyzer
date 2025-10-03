import {type FormEvent, useState} from 'react'
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";
import {convertPdfToImage} from "~/lib/pdf2img";
import {generateUUID} from "~/lib/utils";
import {prepareInstructions, AIResponseFormat} from "../../constants";
import Aurora from "~/components/Aurora";

const Upload = () => {
    const { auth, isLoading, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (file: File | null) => {
        setFile(file)
    }

    const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File  }) => {
        setIsProcessing(true);

        setStatusText('Uploading the file...');
        const uploadedFile = await fs.upload([file]);
        if(!uploadedFile) return setStatusText('Error: Failed to upload file');

        setStatusText('Converting to image...');
        const imageFile = await convertPdfToImage(file);
        if(!imageFile.file) return setStatusText('Error: Failed to convert PDF to image');

        setStatusText('Uploading the image...');
        const uploadedImage = await fs.upload([imageFile.file]);
        if (!uploadedImage) {
            return setStatusText('Error: Failed to upload image');
        }

        setStatusText('Preparing data...');
        const uuid = generateUUID();
        let resumeData = {
            id: uuid,
            resumePath: uploadedFile.path,
            imagePath: uploadedImage.path,
            companyName,
            jobTitle,
            jobDescription,
            feedback: null,
        };

        try {
            setStatusText('Analyzing...');
            const instructions = prepareInstructions({ jobTitle, jobDescription, AIResponseFormat: AIResponseFormat });
            const feedbackResponse = await ai.feedback(uploadedFile.path, instructions);

            if (!feedbackResponse || !feedbackResponse.message?.content) {
                console.error("AI feedback response is empty or malformed.");
                setStatusText('Error: AI analysis failed.');
                await kv.set(`resume:${uuid}`, JSON.stringify(resumeData));
                navigate(`/resume/${uuid}`);
                return;
            }

            const feedbackText = typeof feedbackResponse.message.content === 'string'
                ? feedbackResponse.message.content
                : feedbackResponse.message.content[0].text;

            console.log("Raw AI response:", feedbackText);

            const parsedFeedback = JSON.parse(feedbackText);
            resumeData.feedback = parsedFeedback;

            setStatusText('Analysis complete, saving...');
            await kv.set(`resume:${uuid}`, JSON.stringify(resumeData));
            setStatusText('Analysis complete, redirecting...');
            navigate(`/resume/${uuid}`);
        } catch (error) {
            console.error("Error during analysis or parsing:", error);
            setStatusText('Error: Analysis failed. See console for details.');
            await kv.set(`resume:${uuid}`, JSON.stringify(resumeData));
            navigate(`/resume/${uuid}`);
        }
    };


    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isProcessing || !file) return;

        const form = event.currentTarget;
        const companyName = (form.elements.namedItem('company-name') as HTMLInputElement).value;
        const jobTitle = (form.elements.namedItem('job-title') as HTMLInputElement).value;
        const jobDescription = (form.elements.namedItem('job-description') as HTMLTextAreaElement).value;

        handleAnalyze({ companyName, jobTitle, jobDescription, file });
    };

    return (
        <main>
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
            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Enhance your resume with AI insights and take the next step toward your career goals</h1>

                </div>

                <div className="page-heading ">
                    {isProcessing ? (
                        <div className="flex flex-col items-center gap-4">
                            <img src="/images/resume-scan.gif" className="w-full" alt={'g'} />
                            <h2 className="text-2xl font-semibold text-gray-700">{statusText}</h2>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8 ">
                            <div className="form-div">
                                <label htmlFor="company-name">Company Name</label>
                                <input type="text" name="company-name" placeholder="Company Name" id="company-name"/>
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-title">Job Title</label>
                                <input type="text" name="job-title" placeholder="Job Title" id="job-title" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-description">Job Description</label>
                                <textarea rows={5} name="job-description" placeholder="Job Description" id="job-description" />
                            </div>

                            <div className="form-div">
                                <label htmlFor="uploader">Upload Resume</label>
                                <FileUploader onFileSelect={handleFileSelect} />
                            </div>

                            <div className="relative pl-10">
                            <button className="fancy-btn" type="submit">
                                Analyze Resume
                            </button>
                            </div>
                        </form>
                    )}
                </div>
            </section>
            </div>
        </main>
    )
}
export default Upload