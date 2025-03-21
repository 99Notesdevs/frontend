import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

type PathSelectorProps = {
  onPathChange: (path: string[]) => void;
}

export default function PathSelector({ onPathChange }: PathSelectorProps) {
  const [examID, setExamID] = useState<string>('');
  const [domainID, setDomainID] = useState<string>('');
  const [subjectID, setSubjectID] = useState<string>('');
  const [chapterID, setChapterID] = useState<string>('');
  const [topicID, setTopicID] = useState<string>('');
  const [articleID, setArticleID] = useState<string>('');

  const token = Cookies.get('token') || '';

  const [examOptions, setExamOptions] = useState<{ id: string; title: string }[]>([]);
  const [domainOptions, setDomainOptions] = useState<{ id: string; title: string }[]>([]);
  const [subjectOptions, setSubjectOptions] = useState<{ id: string; title: string }[]>([]);
  const [chapterOptions, setChapterOptions] = useState<{ id: string; title: string }[]>([]);
  const [topicOptions, setTopicOptions] = useState<{ id: string; title: string }[]>([]);
  const [articleOptions, setArticleOptions] = useState<{ id: string; title: string }[]>([]);

  useEffect(() => {
    onPathChange([examID, domainID, subjectID, chapterID, topicID, articleID].filter(Boolean));
  }, [examID, domainID, subjectID, chapterID, topicID, articleID, onPathChange]);

  useEffect(() => {
    const fetchOptions = async () => {
      const newOptions = await getOptions(1);
      setExamOptions(newOptions);
    };
    fetchOptions();
  }, []);

  useEffect(() => {
    if (examID) {
      const fetchOptions = async () => {
        const newOptions = await getOptions(2);
        setDomainOptions(newOptions);
      };
      fetchOptions();
    }
  }, [examID]);

  useEffect(() => {
    if (domainID) {
      const fetchOptions = async () => {
        const newOptions = await getOptions(3);
        setSubjectOptions(newOptions);
      };
      fetchOptions();
    }
  }, [domainID]);

  useEffect(() => {
    if (subjectID) {
      const fetchOptions = async () => {
        const newOptions = await getOptions(4);
        setChapterOptions(newOptions);
      };
      fetchOptions();
    }
  }, [subjectID]);

  useEffect(() => {
    if (chapterID) {
      const fetchOptions = async () => {
        const newOptions = await getOptions(5);
        setTopicOptions(newOptions);
      };
      fetchOptions();
    }
  }, [chapterID]);

  useEffect(() => {
    if (topicID) {
      const fetchOptions = async () => {
        const newOptions = await getOptions(6);
        setArticleOptions(newOptions);
      };
      fetchOptions();
    }
  }, [topicID]);

  const getOptions = async (level: number): Promise<{ id: string; title: string }[]> => {
    switch (level) {
      case 1:
        const exams = await axios.get('http://localhost:5000/api/v1/exam', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return exams.data.data;
      case 2:
        if (!examID) return [];
        const domains = await axios.get(`http://localhost:5000/api/v1/domain/parent/${examID}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return domains.data.data;
      case 3:
        if (!domainID) return [];
        const subjects = await axios.get(`http://localhost:5000/api/v1/subject/parent/${domainID}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return subjects.data.data;
      case 4:
        if (!subjectID) return [];
        const chapters = await axios.get(`http://localhost:5000/api/v1/chapter/parent/${subjectID}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return chapters.data.data;
      case 5:
        if (!chapterID) return [];
        const topics = await axios.get(`http://localhost:5000/api/v1/topic/parent/${chapterID}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return topics.data.data;
      case 6:
        if (!topicID) return [];
        const articles = await axios.get(`http://localhost:5000/api/v1/article/parent/${topicID}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return articles.data.data;
      default:
        return [];
    }
  };

  const handleChange = (level: number, value: string) => {
    switch (level) {
      case 1:
        setExamID(value);
        setDomainID('');
        setSubjectID('');
        setChapterID('');
        setTopicID('');
        setArticleID('');
        setDomainOptions([]);
        setSubjectOptions([]);
        setChapterOptions([]);
        setTopicOptions([]);
        setArticleOptions([]);
        break;
      case 2:
        setDomainID(value);
        setSubjectID('');
        setChapterID('');
        setTopicID('');
        setArticleID('');
        setSubjectOptions([]);
        setChapterOptions([]);
        setTopicOptions([]);
        setArticleOptions([]);
        break;
      case 3:
        setSubjectID(value);
        setChapterID('');
        setTopicID('');
        setArticleID('');
        setChapterOptions([]);
        setTopicOptions([]);
        setArticleOptions([]);
        break;
      case 4:
        setChapterID(value);
        setTopicID('');
        setArticleID('');
        setTopicOptions([]);
        setArticleOptions([]);
        break;
      case 5:
        setTopicID(value);
        setArticleID('');
        setArticleOptions([]);
        break;
      case 6:
        setArticleID(value);
        break;
    }
  };  

  return (
    <div className="flex gap-2 items-center">
      <select
        value={examID}
        onChange={(e) => handleChange(1, e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-1.5 bg-white text-gray-700 text-sm"
      >
        <option value="">Select Exam</option>
        {examOptions.map((option) => (
          <option key={option.id} value={option.id}>
            {option.title}
          </option>
        ))}
      </select>
      <select
        value={domainID}
        onChange={(e) => handleChange(2, e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-1.5 bg-white text-gray-700 text-sm"
        disabled={!examID}
      >
        <option value="">Select Domain</option>
        {domainOptions.map((option) => (
          <option key={option.id} value={option.id}>
            {option.title}
          </option>
        ))}
      </select>
      <select
        value={subjectID}
        onChange={(e) => handleChange(3, e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-1.5 bg-white text-gray-700 text-sm"
        disabled={!domainID}
      >
        <option value="">Select Subject</option>
        {subjectOptions.map((option) => (
          <option key={option.id} value={option.id}>
            {option.title}
          </option>
        ))}
      </select>
      <select
        value={chapterID}
        onChange={(e) => handleChange(4, e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-1.5 bg-white text-gray-700 text-sm"
        disabled={!subjectID}
      >
        <option value="">Select Chapter</option>
        {chapterOptions.map((option) => (
          <option key={option.id} value={option.id}>
            {option.title}
          </option>
        ))}
      </select>
      <select
        value={topicID}
        onChange={(e) => handleChange(5, e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-1.5 bg-white text-gray-700 text-sm"
        disabled={!chapterID}
      >
        <option value="">Select Topic</option>
        {topicOptions.map((option) => (
          <option key={option.id} value={option.id}>
            {option.title}
          </option>
        ))}
      </select>
      <select
        value={articleID}
        onChange={(e) => handleChange(6, e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-1.5 bg-white text-gray-700 text-sm"
        disabled={!topicID}
      >
        <option value="">Select Article</option>
        {articleOptions.map((option) => (
          <option key={option.id} value={option.id}>
            {option.title}
          </option>
        ))}
      </select>
    </div>
  );
}
