import logo from './logo.svg';
import './App.css';
import { useState } from 'react'; // State 사용

// 사용자 정의태그(컴포넌트)
function Header(props) { // prop(속성) 생성
  console.log('props', props, props.title);
  return <header>
    <h1><a href="/" onClick={function (event) { // 사용자가 링크를 클릭하면 onClick 이벤트 발생
      event.preventDefault(); // 이벤트의 기본 동작을 방지(페이지 리로드 방지)
      props.onChangeMode(); // 부모 컴포넌트에서 전달된 함수
    }}>{props.title}</a></h1>
  </header>
}
// 키 값은 고유해야 한다 (자동으로 생성한 태그는 태그를 추적할 때 근거가 있어야 함)
function Nav(props) {
  const lis = []
  for (let i = 0; i < props.topics.length; i++) {
    let t = props.topics[i];
    lis.push(<li key={t.id}>
      <a id={t.id} href={'/read' + t.id} onClick={event => { // 파라미터가 하나일 경우 괄호 생략 가능
        // 태그의 속성으로 id 값을 넘기면 문자열로 된다
        event.preventDefault();
        props.onChangeMode(Number(event.target.id));
      }}>{t.title}</a></li>);
  }
  // 리액트가 원소를 읽어서 배치
  return <nav>
    <ol>
      {lis}
    </ol>
  </nav>
}
function Article(props) {
  return <article>
    <h2>{props.title}</h2>
    {props.body}
  </article>
}

function Create(props) {
  return <article>
    <h2>Create</h2>
    <form onSubmit={event => {
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onCreate(title, body);
    }}>
      <p><input type="text" name="title" placeholder="title" /></p>
      <p><textarea name="body" placeholder="body" /></p>
      <p><input type="submit" value="Create" /></p>
    </form>
  </article>
}

function Update(props) {
  // state로 환산
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.title);
  return <article>
    <h2>Update</h2>
    <form onSubmit={event => {
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onUpdate(title, body);
    }}>
      <p><input type="text" name="title" placeholder="title" value={title} onChange={event => {
        setTitle(event.target.value);
      }} /></p>
      <p><textarea name="body" placeholder="body" value={body} onChange={event => {
        setBody(event.target.value)
      }}
      /></p>
      <p><input type="submit" value="Update" /></p>
    </form>
  </article>
}

function App() {
  //const _mode = useState('WELCOME'); // State의 초기값
  //const mode = _mode[0]; // 0번째 인덱스로 State값을 읽는다
  //const setMode = _mode[1]; // 1번째 인덱스로 State값을 수정한다
  const [mode, setMode] = useState('WELCOME');
  const [id, setId] = useState(null);

  const [nextId, setNextId] = useState(4);
  const [topics, setTopics] = useState([
    { id: 1, title: 'html', body: 'html is ...' },  // 키 값은 고유해야 한다
    { id: 2, title: 'css', body: 'css is ...' },
    { id: 3, title: 'javascript', body: 'javascript is ...' }
  ]); //변경 못하게 const 붙이기

  let content = null;
  let contextControl = null;

  if (mode === 'WELCOME') {
    content = <Article title="Welcome" body="Hello, Web"></Article>
  }
  else if (mode === 'READ') {
    let title, body = null;
    for (let i = 0; i < topics.length; i++) {
      if (topics[i].id === id) {
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Article title={title} body={body}></Article>
    contextControl = <li><a href={'/update' + id} onClick={event => {
      event.preventDefault();
      setMode('UPDATE');
    }}>Update</a></li>
  }
  else if (mode === 'CREATE') {
    content = <Create onCreate={(_title, _body) => {
      const newTopic = { id: nextId, title: _title, body: _body }
      const newTopics = [...topics] // 배열 복제본
      newTopics.push(newTopic); // 복제본에 push
      setTopics(newTopics); // setValue로 값 변경
      setMode('READ');
      setId(nextId);
      setNextId(nextId + 1);
    }}></Create>
  }
  else if (mode === 'UPDATE') {
    let title, body = null;
    for (let i = 0; i < topics.length; i++) {
      if (topics[i].id === id) {
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Update title={title} body={body} onUpdate={(title, body) => {
      const newTopics = [...topics]
      const updateTopic = { id: id, title: title, body: body }
      for (let i = 0; i < newTopics.length; i++) {
        if (newTopics[i].id === id) {
          newTopics[i] = updateTopic;
          break;
        }
      }
      setTopics(newTopics);
      setMode('READ');
    }}></Update>
  }

  return (
    <div>
      <Header title="WEB" onChangeMode={function () {
        setMode('WELCOME');
      }}></Header>
      <Nav topics={topics} onChangeMode={(_id) => {
        //alert(id);
        setMode('READ');
        setId(_id);
      }}></Nav>
      {content}
      <ul>
        <li><a href="/create" onClick={event => {
          event.preventDefault();
          setMode('CREATE');
        }}>Create</a></li>
        {contextControl}
      </ul>
    </div>
  );
}

export default App;
