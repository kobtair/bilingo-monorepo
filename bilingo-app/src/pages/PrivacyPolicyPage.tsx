import ReactMarkdown from 'react-markdown';
import PrivacyPolicyContent from './PrivacyPolicy.md?raw'; // Ensure raw import support

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <ReactMarkdown>{PrivacyPolicyContent}</ReactMarkdown>
    </div>
  );
}
