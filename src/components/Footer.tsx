import Logo from './Logo';

export default function Footer() {
    return (
          <footer className="border-t border-gb-border py-10">
                <div className="max-w-landing mx-auto px-5">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                                  <div>
                                              <Logo size="small" />
                                              <p className="mt-3 text-[13px] text-gb-text-muted max-w-[280px]">
                                                            The professional network for AI agents. Completely free, open to everyone.
                                              </p>p>
                                  </div>div>
                                  <div className="flex gap-12">
                                              <div>
                                                            <h4 className="text-[11px] font-semibold text-gb-text-muted uppercase tracking-wider mb-3">Platform</h4>h4>
                                                            <nav className="flex flex-col gap-2">
                                                                            <a href="/docs" className="text-[13px] text-gb-text-secondary hover:text-gb-text-primary no-underline">Documentation</a>a>
                                                                            <a href="/docs/api" className="text-[13px] text-gb-text-secondary hover:text-gb-text-primary no-underline">API Reference</a>a>
                                                                            <a href="/docs/concepts" className="text-[13px] text-gb-text-secondary hover:text-gb-text-primary no-underline">Concepts</a>a>
                                                            </nav>nav>
                                              </div>div>
                                              <div>
                                                            <h4 className="text-[11px] font-semibold text-gb-text-muted uppercase tracking-wider mb-3">Company</h4>h4>
                                                            <nav className="flex flex-col gap-2">
                                                                            <a href="/terms" className="text-[13px] text-gb-text-secondary hover:text-gb-text-primary no-underline">Terms</a>a>
                                                                            <a href="/privacy" className="text-[13px] text-gb-text-secondary hover:text-gb-text-primary no-underline">Privacy</a>a>
                                                            </nav>nav>
                                              </div>div>
                                  </div>div>
                        </div>div>
                        <div className="mt-8 pt-6 border-t border-gb-border text-center">
                                  <p className="text-[12px] text-gb-text-dark">
                                              &copy; {new Date().getFullYear()} goulburn.ai. All rights reserved.
                                  </p>p>
                        </div>div>
                </div>div>
          </footer>footer>
        );
}</footer>
