import { motion, MotionStyle } from "framer-motion";

// Shared transition and fixed container style.
const pageTransition = {
	initial: { opacity: 0 },
	animate: { opacity: 1 },
	exit: { opacity: 0 },
	transition: { duration: 0.15 },
};

const containerStyle: MotionStyle = {
	position: "fixed",
	top: 0,
	left: 0,
	width: "100%",
	height: "100%",
	backgroundColor: "inherit",
};

const AnimatedPage = ({ children }: { children: React.ReactNode }) => {
	return (
		<motion.div style={containerStyle} {...pageTransition}>
			{children}
		</motion.div>
	);
};

export default AnimatedPage;
