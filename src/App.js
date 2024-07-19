import logo from './logo.svg';
import './App.css';
import { useState } from 'react'; // useState 훅을 사용하여 상태를 관리

// 사용자 정의 컴포넌트 Header
function Header(props) { // props를 통해 부모 컴포넌트로부터 속성을 받는다.
  console.log('props', props, props.title);
  return (
    <header>
      <h1>
        <a href="/" onClick={function (event) { // 사용자가 링크를 클릭했을 때 onClick 이벤트가 발생
          event.preventDefault(); // 링크의 기본 동작(페이지 리로드)을 방지
          props.onChangeMode(); // 부모 컴포넌트로부터 전달된 함수를 호출
        }}>{props.title}</a>
      </h1>
    </header>
  );
}

// 사용자 정의 컴포넌트 Nav
function Nav(props) {
  const lis = []
  // props로 받은 topics 배열을 순회하면서 리스트 항목을 생성
  for (let i = 0; i < props.topics.length; i++) {
    let t = props.topics[i];
    lis.push(
      <li key={t.id}> {/* key 값은 각 리스트 항목이 고유해야 한다. */}
        <a id={t.id} href={'/read' + t.id} onClick={event => { // 링크 클릭 시 이벤트가 발생
          event.preventDefault(); // 기본 동작(페이지 리로드)을 방지합니다.
          props.onChangeMode(Number(event.target.id)); // 클릭한 항목의 id를 부모 컴포넌트로 전달
        }}>{t.title}</a>
      </li>
    );
  }
  // 생성한 리스트 항목들을 리턴
  return (
    <nav>
      <ol>
        {lis}
      </ol>
    </nav>
  );
}

// 사용자 정의 컴포넌트 Article
function Article(props) {
  return (
    <article>
      <h2>{props.title}</h2> {/* props로 받은 제목을 출력 */}
      {props.body} {/* props로 받은 본문을 출력 */}
    </article>
  );
}

// 사용자 정의 컴포넌트 Create
function Create(props) {
  return (
    <article>
      <h2>Create</h2>
      <form onSubmit={event => { // 폼이 제출되었을 때 실행
        event.preventDefault(); // 폼 제출의 기본 동작(페이지 리로드)을 방지
        const title = event.target.title.value; // 입력된 제목을 가져온다.
        const body = event.target.body.value; // 입력된 본문을 가져온다.
        props.onCreate(title, body); // 입력된 데이터를 부모 컴포넌트로 전달
      }}>
        <p><input type="text" name="title" placeholder="title" /></p> {/* 제목 입력 필드 */}
        <p><textarea name="body" placeholder="body" /></p> {/* 본문 입력 필드 */}
        <p><input type="submit" value="Create" /></p> {/* 제출 버튼 */}
      </form>
    </article>
  );
}

// 사용자 정의 컴포넌트 Update
function Update(props) {
  // 컴포넌트의 로컬 상태를 사용하여 입력 필드의 값을 관리
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);
  return (
    <article>
      <h2>Update</h2>
      <form onSubmit={event => {
        event.preventDefault(); // 폼 제출의 기본 동작(페이지 리로드)을 방지
        const title = event.target.title.value; // 입력된 제목을 가져온다.
        const body = event.target.body.value; // 입력된 본문을 가져온다.
        props.onUpdate(title, body); // 입력된 데이터를 부모 컴포넌트로 전달
      }}>
        <p><input type="text" name="title" placeholder="title" value={title} onChange={event => {
          setTitle(event.target.value); // 입력 필드의 값이 변경될 때마다 상태를 업데이트
        }} /></p>
        <p><textarea name="body" placeholder="body" value={body} onChange={event => {
          setBody(event.target.value); // 입력 필드의 값이 변경될 때마다 상태를 업데이트
        }} /></p>
        <p><input type="submit" value="Update" /></p> {/* 제출 버튼 */}
      </form>
    </article>
  );
}

function App() {
  // useState를 사용하여 상태를 정의
  const [mode, setMode] = useState('WELCOME'); // 초기 모드는 'WELCOME'
  const [id, setId] = useState(null); // 선택된 항목의 id를 저장
  const [nextId, setNextId] = useState(4); // 다음 항목의 id를 관리
  const [topics, setTopics] = useState([
    { id: 1, title: 'html', body: 'html is ...' }, // 초기 데이터
    { id: 2, title: 'css', body: 'css is ...' },
    { id: 3, title: 'javascript', body: 'javascript is ...' }
  ]);

  // content와 contextControl 변수를 초기화
  let content = null;
  let contextControl = null;

  // 현재 모드에 따라 다른 content를 설정
  if (mode === 'WELCOME') {
    content = <Article title="Welcome" body="Hello, Web"></Article>
  } else if (mode === 'READ') {
    let title, body = null;
    for (let i = 0; i < topics.length; i++) {
      if (topics[i].id === id) {
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Article title={title} body={body}></Article>
    contextControl = <>
      <li><a href={'/update' + id} onClick={event => {
        event.preventDefault();
        setMode('UPDATE'); // 'UPDATE' 모드로 변경
      }}>Update</a></li>
      <li><input type="button" value="Delete" onClick={() => {
        const newTopics = topics.filter(topic => topic.id !== id); // 선택된 항목을 삭제
        setTopics(newTopics); // 상태를 업데이트
        setMode('WELCOME'); // 'WELCOME' 모드로 변경
      }} /></li>
    </>
  } else if (mode === 'CREATE') {
    content = <Create onCreate={(_title, _body) => {
      const newTopic = { id: nextId, title: _title, body: _body }; // 새 항목을 생성
      const newTopics = [...topics, newTopic]; // 기존 항목에 새 항목을 추가
      setTopics(newTopics); // 상태를 업데이트
      setMode('READ'); // 'READ' 모드로 변경
      setId(nextId); // 새 항목의 id를 설정
      setNextId(nextId + 1); // 다음 id를 증가
    }}></Create>
  } else if (mode === 'UPDATE') {
    let title, body = null;
    for (let i = 0; i < topics.length; i++) {
      if (topics[i].id === id) {
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Update title={title} body={body} onUpdate={(title, body) => {
      const newTopics = topics.map(topic => topic.id === id ? { id, title, body } : topic); // 선택된 항목을 업데이트
      setTopics(newTopics); // 상태를 업데이트
      setMode('READ'); // 'READ' 모드로 변경
    }}></Update>
  }

  // 최종적으로 렌더링할 JSX를 리턴
  return (
    <div>
      <Header title="WEB" onChangeMode={() => setMode('WELCOME')}></Header> {/* Header 컴포넌트를 렌더링 */}
      <Nav topics={topics} onChangeMode={_id => {
        setMode('READ');
        setId(_id); // 선택된 항목의 id를 설정
      }}></Nav>
      {content}
      <ul>
        <li><a href="/create" onClick={event => {
          event.preventDefault();
          setMode('CREATE'); // 'CREATE' 모드로 변경
        }}>Create</a></li>
        {contextControl}
      </ul>
    </div>
  );
}

export default App; 
