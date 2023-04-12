pnpm i && pnpm build
rm -rf build.zip
zip -r build.zip dist manifest.yml
