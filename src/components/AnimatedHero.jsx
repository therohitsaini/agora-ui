import { motion } from "framer-motion";
import bgImage from "../assets/image/agoraBG.jpg";

export default function AnimatedHero({ children }) {
    return (
        <motion.div
            initial={{ backgroundPosition: "0% 0%" }}
            animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
            transition={{
                duration: 50,
                repeat: Infinity,
                repeatType: "reverse",
            }}
            style={{
                minHeight: "100vh",
                backgroundImage: `url(${bgImage})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                position: "relative", // ⭐ so stars overlay can sit on top
                overflow: "hidden",
            }}
        >
            {/* Stars layer */}
            <motion.div
                initial={{ backgroundPosition: "0% 0%" }}
                animate={{ backgroundPosition: ["0% 0%", "200% 200%"] }}
                transition={{
                    duration: 80,
                    repeat: Infinity,
                    repeatType: "loop",
                }}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `radial-gradient(2px 2px at 20% 30%, white, transparent),
                            radial-gradient(1.5px 1.5px at 70% 80%, white, transparent),
                            radial-gradient(2px 2px at 90% 10%, white, transparent),
                            radial-gradient(1px 1px at 40% 60%, white, transparent)`,
                    backgroundSize: "200px 200px",
                    opacity: 0.8,
                    pointerEvents: "none", // so it doesn’t block clicks
                }}
            />

            {/* Main Content */}
            <div style={{ position: "relative", zIndex: 2 }}>{children}</div>
        </motion.div>
    );
}
