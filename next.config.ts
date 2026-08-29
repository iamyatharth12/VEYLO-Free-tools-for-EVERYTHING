import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: '/jwt-decoder', destination: '/tools/jwt-decoder' },
      { source: '/url-encoder', destination: '/tools/url-encoder' },
      { source: '/url-parser', destination: '/tools/url-parser' },
      { source: '/http-status-codes', destination: '/tools/http-status-codes' },
      { source: '/unix-timestamp', destination: '/tools/unix-timestamp' },
      { source: '/cron-generator', destination: '/tools/cron-generator' },
      { source: '/html-entities', destination: '/tools/html-entities' },
      { source: '/xml-formatter', destination: '/tools/xml-formatter' },
      { source: '/sql-formatter', destination: '/tools/sql-formatter' },
      { source: '/markdown-preview', destination: '/tools/markdown-preview' },
      { source: '/diff-checker', destination: '/tools/diff-checker' },
      { source: '/json-yaml', destination: '/tools/json-yaml' },
      { source: '/jwt-generator', destination: '/tools/jwt-generator' },
      { source: '/lorem-ipsum', destination: '/tools/lorem-ipsum' },
      { source: '/user-agent-parser', destination: '/tools/user-agent-parser' },
    ];
  },
};

export default nextConfig;
