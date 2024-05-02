interface Props {
  id: string;
  videoId: string;
  poster: string;
}

const VideoPlayer = ({ id, videoId, poster }: Props) => (
  <div
    key={id}
    className="group shadow-2xl rounded-2xl transform duration-500 hover:-translate-y-2"
  >
    <video className="w-full h-[550px]" controls poster={poster}>
      <source src={videoId} type="video/mp4" />
    </video>
  </div>
);

export default VideoPlayer;
