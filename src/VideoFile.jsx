import React, { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import "./App.css";

const VideoFile = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [captions, setCaptions] = useState([]);
  const [currentCaption, setCurrentCaption] = useState({ text: "", time: "" });
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef(null);

  const handleUrlChange = (e) => {
    setVideoUrl(e.target.value);
  };

  const handleCaptionChange = (e) => {
    setCurrentCaption({ ...currentCaption, text: e.target.value });
  };

  const handleTimeChange = (e) => {
    setCurrentCaption({ ...currentCaption, time: e.target.value });
  };

  const addCaption = () => {
    if (currentCaption.text && currentCaption.time) {
      setCaptions([...captions, { ...currentCaption }]);
      setCurrentCaption({ text: "", time: "" });
    }
  };

  const [displayedCaption, setDisplayedCaption] = useState("");
  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current) {
        const currentTime = playerRef.current.getCurrentTime();
        const matchingCaption = captions.find(
          (caption) => Math.abs(currentTime - parseFloat(caption.time)) < 0.5
        );
        setDisplayedCaption(matchingCaption ? matchingCaption.text : "");
      }
    }, 200);
    return () => clearInterval(interval);
  }, [captions]);

  return (
    <div className="app flex justify-center items-center w-full bg-red-600">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Video Caption Creator</h1>
      <div className="input-section">
        <input
          type="text"
          placeholder="Enter video URL"
          value={videoUrl}
          onChange={handleUrlChange}
          className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring focus:ring-blue-300"
        />
        <textarea
          placeholder="Enter caption text"
          value={currentCaption.text}
          onChange={handleCaptionChange}
          className="w-full border border-gray-300 rounded-md p-2 resize-none focus:outline-none focus:ring focus:ring-blue-300"
        ></textarea>
        <input
          type="number"
          placeholder="Enter timestamp (seconds)"
          value={currentCaption.time}
          onChange={handleTimeChange}
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
        />
        <button
          onClick={addCaption}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
        >
          Add Caption
        </button>
      </div>
      <div className="video-section">
        {videoUrl && (
          <ReactPlayer
            ref={playerRef}
            url={videoUrl}
            playing={isPlaying}
            controls={true}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="w-full max-w-full aspect-video"
          />
        )}
        <div className="caption-display">{displayedCaption}</div>
      </div>
      <div className="caption-list">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Added Captions</h3>
        <ul className="list-disc pl-5 text-gray-700">
          {captions.map((caption, index) => (
            <li key={index}>{`[${caption.time}s] ${caption.text}`}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VideoFile;
