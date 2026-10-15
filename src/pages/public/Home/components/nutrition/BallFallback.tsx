export default function BallFallback() {
    return (
        <div
            className="size-full rounded-full opacity-50 blur-sm"
            style={{
                background:
                    "radial-gradient(circle at 35% 30%, #ffb066 0%, #ff6a00 35%, #7a2d00 70%, transparent 100%)",
            }}
        />
    );
}