import "font-awesome/css/font-awesome.css";

interface Props {
  liked: boolean | undefined;
  onLike: () => void;
}

const Like: React.FC<Props> = (props) => {
  return (
    <div>
      {props.liked ? (
        <i
          className="fa fa-heart"
          aria-hidden="true"
          style={{ cursor: "pointer" }}
          onClick={props.onLike}
        ></i>
      ) : (
        <i
          className="fa fa-heart-o"
          aria-hidden="true"
          style={{ cursor: "pointer" }}
          onClick={props.onLike}
        ></i>
      )}
    </div>
  );
};

export default Like;
