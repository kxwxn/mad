/**
 * 환경 변수 검증 및 안전한 접근을 위한 유틸리티 함수들
 * 
 * 주의: 클라이언트 컴포넌트("use client")에서는 이 함수들을 사용하지 마세요.
 * 클라이언트 컴포넌트에서는 process.env.NEXT_PUBLIC_*를 직접 사용하세요.
 * Next.js가 빌드 타임에 자동으로 번들에 포함시킵니다.
 * 
 * 이 함수들은 서버 컴포넌트나 API 라우트에서만 사용하세요.
 */

/**
 * 필수 환경 변수를 가져오고 검증합니다.
 * 값이 없으면 에러를 throw합니다.
 * 서버 사이드 전용입니다.
 */
export function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}. ` +
      `Please check your .env file or environment configuration.`
    );
  }
  return value;
}

/**
 * 선택적 환경 변수를 가져옵니다.
 * 값이 없으면 기본값을 반환합니다.
 * 서버 사이드 전용입니다.
 */
export function getOptionalEnv(key: string, defaultValue: string = ''): string {
  return process.env[key] || defaultValue;
}

/**
 * 필수 NEXT_PUBLIC_ 환경 변수를 가져오고 검증합니다.
 * 서버 컴포넌트에서만 사용하세요. 클라이언트 컴포넌트에서는 process.env를 직접 사용하세요.
 */
export function getRequiredPublicEnv(key: string): string {
  if (!key.startsWith('NEXT_PUBLIC_')) {
    throw new Error(`Environment variable ${key} should start with NEXT_PUBLIC_ for client-side access`);
  }
  return getRequiredEnv(key);
}

/**
 * NEXT_PUBLIC_ 환경 변수를 안전하게 가져옵니다.
 * 값이 없으면 기본값을 반환합니다.
 * 서버 컴포넌트에서만 사용하세요. 클라이언트 컴포넌트에서는 process.env를 직접 사용하세요.
 */
export function getOptionalPublicEnv(key: string, defaultValue: string = ''): string {
  if (!key.startsWith('NEXT_PUBLIC_')) {
    throw new Error(`Environment variable ${key} should start with NEXT_PUBLIC_ for client-side access`);
  }
  return getOptionalEnv(key, defaultValue);
}

