import { Button, Col, Image, Input, Row } from "antd";
import Hls from "hls.js";
import { useEffect, useRef, useState } from "react";
import Iphone from "../../asset/images/demo/iphone.png";

const VideoSearch = () => {
  const videoBasePath = "https://feedio-ai.s3.us-east-1.amazonaws.com/media-2/d1/";

  const defaultVideos = ["default-2/default1024_playlist.m3u8"].map(video => videoBasePath + video);

  const videoConditions = {
    "emergency": [
      "emergency/1_playlist.m3u8", "emergency/2_playlist.m3u8", "emergency/3_playlist.m3u8",
      "emergency/4_playlist.m3u8", "emergency/5_playlist.m3u8", "emergency/6_playlist.m3u8",
      "emergency/7_playlist.m3u8", "emergency/8_playlist.m3u8", "emergency/9_playlist.m3u8",
      "emergency/10_playlist.m3u8"
    ].map(video => videoBasePath + video),

    "infectious disease screening followup": [
      "infectious_disease_screening_followup/1_playlist.m3u8", "infectious_disease_screening_followup/2_playlist.m3u8",
      "infectious_disease_screening_followup/3_playlist.m3u8", "infectious_disease_screening_followup/4_playlist.m3u8",
      "infectious_disease_screening_followup/5_playlist.m3u8", "infectious_disease_screening_followup/6_playlist.m3u8",
      "infectious_disease_screening_followup/7_playlist.m3u8", "infectious_disease_screening_followup/8_playlist.m3u8",
      "infectious_disease_screening_followup/9_playlist.m3u8", "infectious_disease_screening_followup/10_playlist.m3u8"
    ].map(video => videoBasePath + video),

    "additional concern": [
      "mh_additional_concern/1_playlist.m3u8", "mh_additional_concern/2_playlist.m3u8", "mh_additional_concern/3_playlist.m3u8",
      "mh_additional_concern/4_playlist.m3u8", "mh_additional_concern/5_playlist.m3u8"
    ].map(video => videoBasePath + video),

    "allergies": [
      "mh_allergies/1_playlist.m3u8", "mh_allergies/2_playlist.m3u8", "mh_allergies/3_playlist.m3u8", "mh_allergies/4_playlist.m3u8"
    ].map(video => videoBasePath + video),

    "family": [
      "mh_family/1_playlist.m3u8", "mh_family/2_playlist.m3u8"
    ].map(video => videoBasePath + video),

    "lifestyle": [
      "mh_lifestyle/1_playlist.m3u8", "mh_lifestyle/2_playlist.m3u8", "mh_lifestyle/3_playlist.m3u8", "mh_lifestyle/4_playlist.m3u8",
      "mh_lifestyle/5_playlist.m3u8"
    ].map(video => videoBasePath + video),

    "medication followup": [
      "mh_medication_followup/1_playlist.m3u8"
    ].map(video => videoBasePath + video),

    "medication": [
      "mh_medication/1_playlist.m3u8", "mh_medication/2_playlist.m3u8", "mh_medication/3_playlist.m3u8"
    ].map(video => videoBasePath + video),

    "past diagnosis": [
      "mh_past_diagnosis/1_playlist.m3u8", "mh_past_diagnosis/2_playlist.m3u8", "mh_past_diagnosis/3_playlist.m3u8", "mh_past_diagnosis/4_playlist.m3u8"
    ].map(video => videoBasePath + video),

    "psychiatric": [
      "mh_psychiatric/1_playlist.m3u8", "mh_psychiatric/2_playlist.m3u8", "mh_psychiatric/3_playlist.m3u8", "mh_psychiatric/4_playlist.m3u8",
      "mh_psychiatric/5_playlist.m3u8"
    ].map(video => videoBasePath + video),

    "pain assessment intensity": [
      "pain_assessment_intensity/1_playlist.m3u8", "pain_assessment_intensity/2_playlist.m3u8", "pain_assessment_intensity/3_playlist.m3u8",
      "pain_assessment_intensity/4_playlist.m3u8", "pain_assessment_intensity/5_playlist.m3u8", "pain_assessment_intensity/6_playlist.m3u8",
      "pain_assessment_intensity/7_playlist.m3u8", "pain_assessment_intensity/8_playlist.m3u8", "pain_assessment_intensity/9_playlist.m3u8",
      "pain_assessment_intensity/10_playlist.m3u8"
    ].map(video => videoBasePath + video),

    "pain assessment location": [
      "pain_assessment_location/1_playlist.m3u8", "pain_assessment_location/2_playlist.m3u8", "pain_assessment_location/3_playlist.m3u8",
      "pain_assessment_location/4_playlist.m3u8", "pain_assessment_location/5_playlist.m3u8", "pain_assessment_location/6_playlist.m3u8",
      "pain_assessment_location/7_playlist.m3u8", "pain_assessment_location/8_playlist.m3u8", "pain_assessment_location/9_playlist.m3u8",
      "pain_assessment_location/10_playlist.m3u8", "pain_assessment_location/11_playlist.m3u8", "pain_assessment_location/12_playlist.m3u8",
      "pain_assessment_location/13_playlist.m3u8", "pain_assessment_location/14_playlist.m3u8", "pain_assessment_location/15_playlist.m3u8"
    ].map(video => videoBasePath + video),

    "pain assessment": [
      "pain_assessment/1_playlist.m3u8", "pain_assessment/2_playlist.m3u8", "pain_assessment/3_playlist.m3u8", "pain_assessment/4_playlist.m3u8",
      "pain_assessment/5_playlist.m3u8", "pain_assessment/6_playlist.m3u8", "pain_assessment/7_playlist.m3u8", "pain_assessment/8_playlist.m3u8",
      "pain_assessment/9_playlist.m3u8", "pain_assessment/10_playlist.m3u8", "pain_assessment/11_playlist.m3u8", "pain_assessment/12_playlist.m3u8",
      "pain_assessment/13_playlist.m3u8", "pain_assessment/14_playlist.m3u8", "pain_assessment/15_playlist.m3u8", "pain_assessment/16_playlist.m3u8",
      "pain_assessment/17_playlist.m3u8"
    ].map(video => videoBasePath + video),

    "reason for visit": [
      "reason_for_visit/1_playlist.m3u8", "reason_for_visit/3_playlist.m3u8", "reason_for_visit/4_playlist.m3u8", "reason_for_visit/5_playlist.m3u8",
      "reason_for_visit/6_playlist.m3u8", "reason_for_visit/7_playlist.m3u8", "reason_for_visit/8_playlist.m3u8", "reason_for_visit/9_playlist.m3u8",
      "reason_for_visit/10_playlist.m3u8", "reason_for_visit/11_playlist.m3u8", "reason_for_visit/13_playlist.m3u8", "reason_for_visit/14_playlist.m3u8",
      "reason_for_visit/15_playlist.m3u8"
    ].map(video => videoBasePath + video),

    "infectious disease screening": [
      "infectious_disease_screening/1_playlist.m3u8", "infectious_disease_screening/2_playlist.m3u8", "infectious_disease_screening/3_playlist.m3u8",
      "infectious_disease_screening/4_playlist.m3u8", "infectious_disease_screening/5_playlist.m3u8", "infectious_disease_screening/6_playlist.m3u8",
      "infectious_disease_screening/7_playlist.m3u8", "infectious_disease_screening/8_playlist.m3u8", "infectious_disease_screening/9_playlist.m3u8",
      "infectious_disease_screening/10_playlist.m3u8", "infectious_disease_screening/11_playlist.m3u8"
    ].map(video => videoBasePath + video)
  };

  const [searchTerm, setSearchTerm] = useState("");
  const videoRef = useRef(null);

  const getRandomVideo = (videos) => {
    return videos[Math.floor(Math.random() * videos.length)];
  };

  const loadVideo = (url, loop = false) => {
    const videoPlayer = videoRef.current;
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(videoPlayer);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoPlayer.loop = loop;
        videoPlayer.play().catch((err) => {
          console.error("Autoplay failed:", err);
        });
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          console.error("HLS Error:", data);
        }
      });

      videoPlayer.onended = () => {
        if (!loop) {
          const nextDefaultVideo = getRandomVideo(defaultVideos);
          loadVideo(nextDefaultVideo, true);
        }
      };
    } else if (videoPlayer.canPlayType("application/vnd.apple.mpegurl")) {
      videoPlayer.src = url;
      videoPlayer.loop = loop;
      videoPlayer.play().catch((err) => {
        console.error("Autoplay failed:", err);
      });
    } else {
      console.error("HLS is not supported in this browser.");
    }
  };

  useEffect(() => {
    const initialVideo = getRandomVideo(defaultVideos);
    loadVideo(initialVideo, true);
  }, []);

  const handlePlayButtonClick = () => {
    const conditionKey = searchTerm.trim().toLowerCase();

    if (videoConditions[conditionKey]) {
      const newVideo = getRandomVideo(videoConditions[conditionKey]);
      loadVideo(newVideo, false);
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      const conditionKey = searchTerm.trim().toLowerCase();
      if (videoConditions[conditionKey]) {
        const newVideo = getRandomVideo(videoConditions[conditionKey]);
        loadVideo(newVideo, false);
      } else {
        alert("Please enter a valid search term.");
      }
    }
  };

  return (
    <div style={{ padding: "5px 20px", backgroundColor: "#003262", minHeight: "100vh" }}>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
      
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "20px" }}>
          <svg
            id="fac65b94-cd11-4344-b0e2-deb33d73f9ff"
            data-name="Layer 2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 661.2 179.5" width={300} height={100}
          >
            <defs>
              <style>{".a8597658-5814-49f1-9e65-d52d119166cf{fill:#fff;}"}</style>
            </defs>
            <path
              className="a8597658-5814-49f1-9e65-d52d119166cf"
              d="M27.4,107.3,5.2,94.6l-5.2,9,22.2,12.7a2.15,2.15,0,0,1,1,2.4l-6.7,24.7,10,2.7,6.7-24.7A12.2,12.2,0,0,0,27.4,107.3Z"
            />
            <path
              className="a8597658-5814-49f1-9e65-d52d119166cf"
              d="M63.2,22.3a2,2,0,0,1-2.4,1L36.1,16.6l-2.7,10,24.7,6.7a12.79,12.79,0,0,0,14.2-5.9L85,5.2,76,0Z"
            />
            <path
              className="a8597658-5814-49f1-9e65-d52d119166cf"
              d="M22.2,63.2,0,75.9l5.2,9L27.4,72.2A12.52,12.52,0,0,0,33.3,58L26.6,33.3,16.6,36l6.7,24.7A2.17,2.17,0,0,1,22.2,63.2Z"
            />
            <path
              className="a8597658-5814-49f1-9e65-d52d119166cf"
              d="M58,146.2l-24.7,6.7,2.7,10,24.7-6.7a2.15,2.15,0,0,1,2.4,1l12.7,22.2,9-5.2L72.1,152A12.46,12.46,0,0,0,58,146.2Z"
            />
            <path
              className="a8597658-5814-49f1-9e65-d52d119166cf"
              d="M157.1,116.3l22.2-12.7-5.2-9-22.2,12.7a12.52,12.52,0,0,0-5.9,14.2l6.7,24.7,10-2.7L156,118.8A2.62,2.62,0,0,1,157.1,116.3Z"
            />
            <path
              className="a8597658-5814-49f1-9e65-d52d119166cf"
              d="M118,33.8a12.42,12.42,0,0,0,3.3-.4L146,26.7l-2.7-10-24.7,6.7a2,2,0,0,1-2.4-1L103.5.2l-9,5.2,12.7,22.2A12.47,12.47,0,0,0,118,33.8Z"
            />
            <path
              className="a8597658-5814-49f1-9e65-d52d119166cf"
              d="M156.2,60.9l6.7-24.7-10-2.7-6.7,24.7A12.3,12.3,0,0,0,152,72.3L174.2,85l5.2-9L157.2,63.3A2.15,2.15,0,0,1,156.2,60.9Z"
            />
            <path
              className="a8597658-5814-49f1-9e65-d52d119166cf"
              d="M107.2,152.1,94.5,174.3l9,5.2,12.7-22.2a2.15,2.15,0,0,1,2.4-1l24.7,6.7,2.7-10-24.7-6.7A12.2,12.2,0,0,0,107.2,152.1Z"
            />
            <path
              className="a8597658-5814-49f1-9e65-d52d119166cf"
              d="M291,63.4c-8,0-16.2,2.5-20.1,6a.5.5,0,0,1-.6,0c-3.3-3.8-9.3-6-16.5-6a27.64,27.64,0,0,0-16.4,5.4c-.2.2-.3.2-.5.1a.43.43,0,0,1-.2-.4V65.8a1.32,1.32,0,0,0-1.3-1.3h-8.6a1.32,1.32,0,0,0-1.3,1.3v47.7a1.32,1.32,0,0,0,1.3,1.3h8.6a1.32,1.32,0,0,0,1.3-1.3V82.7c1-5.7,7.3-9.9,14.8-9.9,8.1,0,11.9,3.2,11.9,10.3v30.4a1.32,1.32,0,0,0,1.3,1.3h8.7a1.32,1.32,0,0,0,1.3-1.3V82.6c.4-5.7,6.7-9.8,14.8-9.8s12,3.2,12,10.1v30.6a1.32,1.32,0,0,0,1.3,1.3h8.6a1.93,1.93,0,0,0,1.6-1.3V83C313,74.6,310.7,63.4,291,63.4Z"
            />
            <path
              className="a8597658-5814-49f1-9e65-d52d119166cf"
              d="M378,64.6h-8.6a1.32,1.32,0,0,0-1.3,1.3v3.6c0,.3-.1.4-.2.4a.75.75,0,0,1-.5-.1c-4.8-4-11.9-6.3-19.5-6.3-16.6,0-27.4,9.9-27.4,25.1,0,16.6,11.7,27.3,29.8,27.3,6.7,0,12.8-2.1,17-5.8a.44.44,0,0,1,.5-.1c.1,0,.3.1.3.4v3.2a1.32,1.32,0,0,0,1.3,1.3H378a1.32,1.32,0,0,0,1.3-1.3V65.9A1.32,1.32,0,0,0,378,64.6Zm-9.9,25.1v.7c-.3,9.9-7.2,16.4-17.5,16.4-10.8,0-18.1-7-18.1-17.6,0-8.4,5.4-16.8,17.4-16.8C360.7,72.4,368.2,79.5,368.1,89.7Z"
            />
            <path
              className="a8597658-5814-49f1-9e65-d52d119166cf"
              d="M441.1,64.5h-9.3a1.3,1.3,0,0,0-1.2.8l-16.7,36.1a.37.37,0,0,1-.4.3.54.54,0,0,1-.4-.3L396.6,65.3a1.3,1.3,0,0,0-1.2-.8h-9.2a1.25,1.25,0,0,0-1.1.6,1.23,1.23,0,0,0-.1,1.3l22.6,45.2a.3.3,0,0,1,0,.4c-4.1,9.1-8.2,15.2-14.6,15.2a18.31,18.31,0,0,1-5.2-.9,1.28,1.28,0,0,0-1.6.9l-1.9,5.8a1.25,1.25,0,0,0,.7,1.6,22.25,22.25,0,0,0,8.5,1.5c11.6,0,18-8.3,25.2-22.6l23.6-47.1a1.5,1.5,0,0,0-.1-1.3A1.15,1.15,0,0,0,441.1,64.5Z"
            />
            <path
              className="a8597658-5814-49f1-9e65-d52d119166cf"
              d="M500,64.6h-8.6a1.32,1.32,0,0,0-1.3,1.3v3.6c0,.3-.1.4-.2.4a.75.75,0,0,1-.5-.1c-4.8-4-11.9-6.3-19.5-6.3-16.6,0-27.4,9.9-27.4,25.1,0,16.6,11.7,27.3,29.8,27.3,6.7,0,12.8-2.1,17.1-5.8a.44.44,0,0,1,.5-.1c.1,0,.3.1.3.4v3.2a1.32,1.32,0,0,0,1.3,1.3H500a1.32,1.32,0,0,0,1.3-1.3V65.9A1.32,1.32,0,0,0,500,64.6Zm-9.9,25.1v.7c-.3,9.9-7.2,16.4-17.5,16.4-10.8,0-18.1-7-18.1-17.6,0-8.4,5.4-16.8,17.4-16.8C482.7,72.4,490.2,79.5,490.1,89.7Z"
            />
            <path
              className="a8597658-5814-49f1-9e65-d52d119166cf"
              d="M587.2,65.7a.85.85,0,0,0-1.1-.7h-6.7a1.2,1.2,0,0,0-1,.7l-16,35.6a1.15,1.15,0,0,1-2.1,0L544.2,65.7a1.2,1.2,0,0,0-1-.7h-6.8a1.08,1.08,0,0,0-1.1.8l-12.2,47.5a1.14,1.14,0,0,0,1.1,1.4h7.2a1.17,1.17,0,0,0,1.1-.9l7.9-31.7a1.11,1.11,0,0,1,2.1-.2l14.4,32a1.2,1.2,0,0,0,1,.7h6.8a1.2,1.2,0,0,0,1-.7l14.5-32.2a1.12,1.12,0,0,1,2.1.2l7.6,31.8a1.17,1.17,0,0,0,1.1.9h7.4a1.14,1.14,0,0,0,1.1-1.4Z"
            />
            <path
              className="a8597658-5814-49f1-9e65-d52d119166cf"
              d="M630.3,64.9H608.5a1.11,1.11,0,0,0-1.1,1.1v47.6a1.11,1.11,0,0,0,1.1,1.1h24.3c14.3,0,28.5-6.5,28.4-25.1C661.4,72.1,649.1,64.9,630.3,64.9Zm1,42.8H618.4a1.11,1.11,0,0,1-1.1-1.1V72.9a1.28,1.28,0,0,1,1.1-1.2h12.9c10.1,0,19.1,4.1,19.1,17.7C650.4,100.7,643.9,107.7,631.3,107.7Z"
            />
          </svg>;
        </div>;


        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          placeholder="Search ..."
          size="large"
          style={{
            width: "100%",
            maxWidth: "600px",
            borderRadius: "50px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
            padding: "4px 20px",
            fontSize: "16px",
            marginBottom: "20px",
          }}
          suffix={
            <Button
              type="primary"
              size="large"
              onClick={handlePlayButtonClick}
              style={{
                borderRadius: "50px",
                padding: "4px 20px",
                fontSize: "16px",
                marginRight: "-12px",
              }}
            >
              Go
            </Button>
          }
        />
      </div>
      <Row gutter={[16, 24]} justify="center">
        <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={4}>
          <div style={{ position: "relative", width: "300px", height: "600px" }}>
            <Image
              preview={false}
              src={Iphone}
              alt="iPhone frame"
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "10px",
              }}
            />
            <video
              ref={videoRef}
              className="video-js vjs-default-skin"
              controls
              style={{
                position: "absolute",
                top: "4%",
                left: "8%",
                width: "83.5%",
                height: "90.5%",
                borderRadius: "40px",
                paddingBottom: "20px",
                background: "#000",
                // objectFit: "cover",
              }}
            >
              Your browser does not support the video.
            </video>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default VideoSearch;




