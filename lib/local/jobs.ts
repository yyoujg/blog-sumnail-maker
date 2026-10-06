// 렌더 큐: 프로세스 메모리. POST는 jobId만 돌려주고 클라이언트가 폴링한다.
// ponytail: dev 서버 재시작 시 사라져도 되는 로컬 도구라 파일 저장 없음.
import { run } from './server';

export type Job = { id: string; label: string; post: string; status: 'running' | 'done' | 'error'; log: string; startedAt: number; endedAt?: number };
// dev(Turbopack)는 API 라우트마다 모듈 인스턴스가 따로라 모듈 변수로는 라우트 간 공유가 안 된다 → globalThis에 둔다.
const g = globalThis as unknown as { __localJobs?: Map<string, Job>; __localJobSeq?: number };
const jobs = (g.__localJobs ??= new Map<string, Job>());

export function startJob(label: string, post: string, work: () => Promise<string>): Job {
  g.__localJobSeq = (g.__localJobSeq ?? 0) + 1;
  const job: Job = { id: `j${g.__localJobSeq}-${Date.now()}`, label, post, status: 'running', log: '', startedAt: Date.now() };
  jobs.set(job.id, job);
  work().then((log) => { job.status = 'done'; job.log = log.split('\n').slice(-30).join('\n'); })
    .catch((e: Error) => { job.status = 'error'; job.log = e.message; })
    .finally(() => { job.endedAt = Date.now(); });
  return job;
}
export const getJob = (id: string) => jobs.get(id);
export const listJobs = () => [...jobs.values()].sort((a, b) => b.startedAt - a.startedAt).slice(0, 50);
export const runJob = (label: string, post: string, cmd: string, args: string[], cwd: string) => startJob(label, post, () => run(cmd, args, cwd));
