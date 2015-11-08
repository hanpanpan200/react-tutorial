var CommentBox = React.createClass({
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: 'false',
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function(){
    return (
      <div className="commentBox">
        <h2>CommentBox</h2>
        <CommentList data={this.state.data}/>
        <CommentForm />
      </div>
    );
  }
});

var CommentList = React.createClass({
  render: function(){
    var commentNodes = this.props.data.map(function(comment) {
      return (
        <div className="commentList">
          <Comment author={comment.author}>{comment.text}</Comment>
        </div>
      );
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

var CommentForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    console.log("refs", this.refs);
    var author = this.refs.author.value.trim();
    var comment = this.refs.comment.value.trim();
    if(!author || !comment) {
      return;
    }
    this.refs.author = '';
    this.refs.comment = '';
    return;
  },
  render: function(){
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Your name" ref="author"/ >
        <input type="text" placeholder="Your comment" ref="comment"/ >
        <input type="submit" value="Post" />
      </form>
    );
  }
});

var Comment = React.createClass({
  rawMarkup: function(){
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return {__html: rawMarkup};
  },
  render: function(){
    return (
      <div className="comment">
        <h3 className="commentAuthor">
          {this.props.author}
        </h3>
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
      </div>
    );
  }
});

ReactDOM.render(
  <CommentBox url="/api/comments" pollInterval={1000}/>,
  document.getElementById('content')
);
