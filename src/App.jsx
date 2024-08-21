import { useState } from 'react'
import Navbar from './Navbar';
import './App.css'
import axios from 'axios';

function App() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  async function generateAnswer() {

    console.log('loading...');
    const response = await axios({
      method: 'POST',
      // url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?apikey',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        contents: [
          { parts: [{ text: question }] },
        ],
      },
    });
    setAnswer(response['data']['candidates'][0]['content']['parts'][0]['text']);
  }function parseAndRenderContent(content) {
    const lines = content.split('\n').filter(Boolean);
    let insideCodeBlock = false;
    let codeBlockContent = '';
  
    return lines.map((line, index) => {
      // Detect the start or end of a code block
      if (line.startsWith('```')) {
        if (!insideCodeBlock) {
          // Start of a code block
          insideCodeBlock = true;
          codeBlockContent = ''; // Reset code block content
          return null; // Skip rendering the line with ```
        } else {
          // End of a code block
          insideCodeBlock = false;
          // Render the code block
          return (
            <div key={index} className="my-4 p-4 bg-gray-100 border border-gray-300 rounded-lg">
              <pre className="font-mono text-sm text-gray-800 whitespace-pre-wrap">
                <code>{codeBlockContent}</code>
              </pre>
            </div>
          );
        }
      }
  
      if (insideCodeBlock) {
        codeBlockContent += `${line}\n`;
        return null; 
      }
  
      // Handle headers (##)
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-xl font-bold my-2">{line.replace('## ', '')}</h2>;
  
      // Handle bold text (**bold**)
      } else if (/\*\*(.*?)\*\*/.test(line)) {
        const parts = line.split(/\*\*(.*?)\*\*/);
        return (
          <p key={index} className="mb-3 text-gray-700 dark:text-gray-400">
            {parts.map((part, i) =>
              i % 2 === 1 ? <strong key={i} className="font-semibold">{part}</strong> : part
            )}
          </p>
        );
  
      // Handle list items (* item)
      } else if (line.startsWith('* ')) {
        return <li key={index} className="list-disc ml-5">{line.replace('* ', '')}</li>;
  
      // Handle regular paragraphs
      } else {
        return <p key={index} className="mb-3 text-gray-700 dark:text-gray-400">{line}</p>;
      }
    });
  }
  
  return (
    <>
<Navbar/>
      <div className="w-full p-4 text-center bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">How can I help you?</h5>
        {/* <div className="mb-5">
          <label htmlFor="large-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            
          </label> */}
          <input
            type="text"
            id="large-input"
            className="block w-full p-4   
          text-gray-900 border border-gray-300 rounded-lg bg-gray-50   
          text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={question} onChange={(e) => setQuestion(e.target.value)}

          />
          <button type="button" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={generateAnswer}>Generate answer</button>
        </div>
      {/* </div> */}
      <div className="w-full p-4 text-center bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">

    
  <div className="font-normal text-gray-700 dark:text-gray-400">
    {parseAndRenderContent(answer)}
  </div>
</div>
      
    </>
  )
}

export default App
