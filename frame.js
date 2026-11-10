/* 앞문 페이지 공통: 구글 웹앱을 화면 가득 띄우고, 웹앱 안의 화면 이동(출석 입력 ↔ 사진 ↔ 통계)을 이 안에서 처리한다.
 * 출석 기록·비밀번호는 여기 저장하지 않는다. (구역장 링크 코드만 이 휴대폰에 기억) */
const EXEC = "https://script.google.com/macros/s/AKfycbzcwCFwd_bOPGYWQlt2xC3mH7p18U0ria6cNPY9or5QZ1iKvXqh4FWFH-VXZNe83JVx/exec";

/** 웹앱 주소에 app=1 을 붙여서 연다 (웹앱이 "앞문 안에서 열렸다"는 걸 알게) */
function appUrl(params) {
  const u = new URL(EXEC);
  Object.entries(params || {}).forEach(([k, v]) => { if (v) u.searchParams.set(k, v); });
  u.searchParams.set("app", "1");
  return u.toString();
}

function openFrame(url) {
  const f = document.getElementById("app"), sp = document.getElementById("splash");
  sp.hidden = false;
  f.onload = () => { sp.hidden = true; };
  f.src = url;
  setTimeout(() => { sp.hidden = true; }, 15000);   // 너무 오래 걸려도 가림막은 치움
}

/* 웹앱 안의 링크(「출석 통계 보기」 등)를 누르면 웹앱이 알려 줌 → 앞문 안에서 그 화면으로 */
window.addEventListener("message", e => {
  if (!/\.googleusercontent\.com$|^https:\/\/script\.google\.com$/.test(e.origin)) return;
  const d = e.data || {};
  if (d.type !== "siheung-go" || typeof d.href !== "string") return;
  let u;
  try { u = new URL(d.href); } catch (x) { return; }
  if (u.origin + u.pathname !== EXEC) return;   // 우리 웹앱 주소만
  u.searchParams.set("app", "1");
  openFrame(u.toString());
});
