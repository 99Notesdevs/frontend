import Link from "next/link";
import { env } from "@/config/env";

const FooterCompressed = () => {
	return (
		<footer className="px-[1.2rem] py-8 text-center border-t border-[var(--border-light)]">
			<div className="font-['Source_Serif_4'] text-[1.25rem] font-bold tracking-[-0.02em] mb-[0.2rem] text-[var(--text-strong)]">
				99
				<em className="italic text-[var(--nav-primary)]">Notes</em>
			</div>

			<div className="text-[0.72rem] text-[var(--text-tertiary)] mb-[0.6rem] leading-[1.55]">
				An Aspirant Funded Community Company · UPSC · SSC · State PSC · CDS · NDA
			</div>

			<div className="flex flex-wrap items-center justify-center gap-2 text-[0.7rem]">
				<Link href="/about" className="no-underline text-[var(--text-tertiary)] hover:text-[var(--nav-secondary)] transition-colors">
					About
				</Link>
				<span className="text-[var(--tertiary)]">·</span>
				<a
					href={env.COMMUNITY_PORTAL}
					target="_blank"
					rel="noopener noreferrer"
					className="no-underline text-[var(--text-tertiary)] hover:text-[var(--nav-secondary)] transition-colors"
				>
					Community
				</a>
				<span className="text-[var(--tertiary)]">·</span>
				<Link href="#" className="no-underline text-[var(--text-tertiary)] hover:text-[var(--nav-secondary)] transition-colors">
					Contribute
				</Link>
				<span className="text-[var(--tertiary)]">·</span>
				<Link href="#" className="no-underline text-[var(--text-tertiary)] hover:text-[var(--nav-secondary)] transition-colors">
					Privacy
				</Link>
			</div>
		</footer>
	);
};

export default FooterCompressed;
