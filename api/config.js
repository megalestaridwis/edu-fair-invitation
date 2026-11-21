module.exports = (req, res) => {
    // Hanya mengirim URL dan Publishable Key (AMAN untuk browser)
    // Private Key dan Database Password TETAP RAHASIA di sisi server
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
    res.status(200).json({
        supabaseUrl: process.env.SUPABASE_URL || "https://rvezikcdevujmubtfoac.supabase.co",
        supabasePublishableKey: process.env.SUPABASE_PUBLISHABLE_KEY || "sb_publishable_eq92XZkau3Z2WhmQfeFPtg_oz9iUOqh"
    });
};
