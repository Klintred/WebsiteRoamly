import React, { useState, useEffect } from 'react';
import "../styles/reviews.css";
import { useNavigate, useLocation } from 'react-router-dom';
import Tag from '../components/Buttons/Tag';
import PrimaryButton from '../components/Buttons/PrimaryButton';

const WriteReviewPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const placeName = params.get("name") || "this place";

  const [responses, setResponses] = useState({
    accessibility: "",
    parkingSuitable: "",
    entranceAccessible: "",
    movement: "",
    restroomsAccessible: "",
    staffSupport: "",
    recommend: ""
  });

  const [textReview, setTextReview] = useState("");
  const [photoFiles, setPhotoFiles] = useState([]);
  const [reviewId, setReviewId] = useState(null);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }

    const token = localStorage.getItem("token");
    if (token) {
      fetch("https://roamly-api.onrender.com/api/v1/users/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch user data.");
          return res.json();
        })
        .then((data) => {
          const user = data.data.user || data.user || data;
          const fetchedUsername = user.firstName || "Anonymous";
          setUsername(fetchedUsername);
          setUserId(user._id);
          localStorage.setItem("username", fetchedUsername);
        })
        .catch((err) => {
          console.error("Failed to fetch user:", err);
          setUsername("Anonymous");
        });
    } else {
      setUsername("Anonymous");
    }
  }, []);

  const handleTagClick = (field, value) => {
    setResponses(prev => ({ ...prev, [field]: value }));
  };

  const resizeImage = (file, maxWidth = 800) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = e => {
        img.src = e.target.result;
      };

      img.onload = () => {
        const scale = maxWidth / img.width;
        const canvas = document.createElement('canvas');
        canvas.width = maxWidth;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        resolve(resizedDataUrl);
      };

      reader.onerror = reject;
      img.onerror = reject;

      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    try {
      const resizedImages = await Promise.all(files.map(file => resizeImage(file)));
      setPhotoFiles(resizedImages);
    } catch (err) {
      console.error("Image resizing failed:", err);
    }
  };

  const handleSubmit = async () => {
    const requiredFields = [
      "accessibility",
      "parkingSuitable",
      "entranceAccessible",
      "movement",
      "restroomsAccessible",
      "staffSupport",
    ];
    const unanswered = requiredFields.filter(field => !responses[field]);
    console.log("responses:", responses);
    console.log("unanswered:", unanswered);
    if (unanswered.length > 0) {
      alert("Please answer all required questions before submitting.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://roamly-api.onrender.com/api/v1/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          general: responses,
          placeName: placeName,
          username: username || "Anonymous",
          userId: userId,
          points: 1,
          sectionsCompleted: ["general"],
          textReview,
          photoUrls: photoFiles
        })
      });

      if (!res.ok) throw new Error("Failed to submit");

      const data = await res.json();
      setReviewId(data._id);
      setShowFollowUp(true);
    } catch (err) {
      console.error(err);
      alert("Submission failed.");
    }
  };

  if (showFollowUp) {
    return (
      <div className="modal-container">
        <div className="modal-content">
          <h1>Thank you for your feedback!</h1>
          <p>Would you like to leave a more detailed review and receive 5 extra points?</p>
          <div className="modal-container-buttons">
            <PrimaryButton text="Yes, continue" onClick={() => navigate(`/review/parking/${reviewId}`)} />
            <PrimaryButton text="No, I'm done" variant="secondary" onClick={() => navigate('/thank-you')} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="write-review-container">
      <div className='container-small'>
        <h1>
          Give feedback for <span className="font-bold">{placeName}</span>
        </h1>
        <div className="write-review-form">
          <div className="write-review-form-group">
            <QuestionGroup label="How would you rate the overall accessibility?" field="accessibility" required>
              <Tag text="Fully accessible" color="green" isSelected={responses.accessibility === "Fully accessible"} onClick={(val) => handleTagClick("accessibility", val)} />
              <Tag text="Adjustments needed" color="orange" isSelected={responses.accessibility === "Adjustments needed"} onClick={(val) => handleTagClick("accessibility", val)} />
              <Tag text="Not accessible" color="red" isSelected={responses.accessibility === "Not accessible"} onClick={(val) => handleTagClick("accessibility", val)} />
            </QuestionGroup>

            <QuestionGroup label="Was the parking suitable for your needs?" field="parkingSuitable" required>
              <Tag text="Yes" color="green" isSelected={responses.parkingSuitable === "Yes"} onClick={(val) => handleTagClick("parkingSuitable", val)} />
              <Tag text="No" color="red" isSelected={responses.parkingSuitable === "No"} onClick={(val) => handleTagClick("parkingSuitable", val)} />
            </QuestionGroup>

            <QuestionGroup label="Was the entrance easily accessible?" field="entranceAccessible" required>
              <Tag text="Yes" color="green" isSelected={responses.entranceAccessible === "Yes"} onClick={(val) => handleTagClick("entranceAccessible", val)} />
              <Tag text="No" color="red" isSelected={responses.entranceAccessible === "No"} onClick={(val) => handleTagClick("entranceAccessible", val)} />
            </QuestionGroup>

            <QuestionGroup label="Could you move around inside without difficulties?" field="movement" required>
              <Tag text="Yes" color="green" isSelected={responses.movement === "Yes"} onClick={(val) => handleTagClick("movement", val)} />
              <Tag text="No" color="red" isSelected={responses.movement === "No"} onClick={(val) => handleTagClick("movement", val)} />
              <Tag text="Not applicable" color="gray" isSelected={responses.movement === "Not applicable"} onClick={(val) => handleTagClick("movement", val)} />
            </QuestionGroup>

            <QuestionGroup label="Were the restroom facilities accessible?" field="restroomsAccessible" required>
              <Tag text="Yes" color="green" isSelected={responses.restroomsAccessible === "Yes"} onClick={(val) => handleTagClick("restroomsAccessible", val)} />
              <Tag text="No" color="red" isSelected={responses.restroomsAccessible === "No"} onClick={(val) => handleTagClick("restroomsAccessible", val)} />
            </QuestionGroup>

            <QuestionGroup label="Was the staff helpful and accommodating?" field="staffSupport" required>
              <Tag text="Yes" color="green" isSelected={responses.staffSupport === "Yes"} onClick={(val) => handleTagClick("staffSupport", val)} />
              <Tag text="No" color="red" isSelected={responses.staffSupport === "No"} onClick={(val) => handleTagClick("staffSupport", val)} />
              <Tag text="Not applicable" color="gray" isSelected={responses.staffSupport === "Not applicable"} onClick={(val) => handleTagClick("staffSupport", val)} />
            </QuestionGroup>

            <QuestionGroup label="Would you recommend this location to others with similar needs?" field="recommend" required>
              <Tag text="Yes" color="green" isSelected={responses.recommend === "Yes"} onClick={(val) => handleTagClick("recommend", val)} />
              <Tag text="No" color="red" isSelected={responses.recommend === "No"} onClick={(val) => handleTagClick("recommend", val)} />
            </QuestionGroup>

            <div className="write-review-form-group">
              <div className='tag-container'>
                <label htmlFor="textReview">Additional comments (optional)</label>
                <textarea
                  id="textReview"
                  className="text-area"
                  rows="4"
                  value={textReview}
                  onChange={(e) => setTextReview(e.target.value)}
                  placeholder="Share any additional thoughts or details about your experience..."
                />
              </div>
            </div>
            <div className="line"></div>
            <div className="write-review-form-group">
              <div className='tag-container'>
                <label htmlFor="photoUpload">Add photos (optional)</label>
                <input
                  id="photoUpload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="custom-file-input"
                />
              </div>
            </div>
            <div className="line"></div>
            <PrimaryButton text="Send" variant="primary" onClick={handleSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
};

const QuestionGroup = ({ label, children, required }) => (
  <div className="write-review-form-group">
    <p>
      {label}
      {required && <span className="required-asterisk"> *</span>}
    </p>
    <div className='tag-container'>
      <div className='tag-subcontainer'>
        {children}
      </div>
    </div>
    <div className="line"></div>
  </div>
);

export default WriteReviewPage;
