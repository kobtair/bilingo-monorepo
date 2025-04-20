import ReactMarkdown from 'react-markdown';
import TermsContent from './TermsOfService.md?raw'; // Ensure raw import support

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <ReactMarkdown>{TermsContent}</ReactMarkdown>
    </div>
  );
}
