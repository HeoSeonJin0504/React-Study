import logo from './logo.svg';
import './App.css';

// 사용자 정의태그(컴포넌트)
function Header(props) { // prop(속성) 생성
  console.log('props', props, props.title);
  return <header>
    <h1><a href="/">{props.title}</a></h1>
  </header>
}
// 키 값은 고유해야 한다 (자동으로 생성한 태그는 태그를 추적할 때 근거가 있어야 함)
function Nav(props) {
  const lis = []
  for (let i = 0; i < props.topics.length; i++) {
    let t = props.topics[i];
    lis.push(<li key={t.id}><a href={'/read' + t.id}>{t.title}</a></li>);
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

function App() {
  const topics = [
    { id: 1, title: 'html', body: 'html is ...' },  // 키 값은 고유해야 한다
    { id: 2, title: 'css', body: 'css is ...' },
    { id: 3, title: 'javascript', body: 'javascript is ...' }
  ] //변경 못하게 const 붙이기
  return (
    <div>
      <Header title="WEB"></Header>
      <Nav topics={topics}></Nav>
      <Article title="Welcome" body="Hello, WEB"></Article>
      <Article title="Hi" body="React"></Article>
    </div>
  );
}

export default App;
