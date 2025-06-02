run in dev: npm run dev
localhost:3000

make sure backend (toran-backend) is up


in contianer:
docker image build -t toran-front .
docker run -dit --name toran-front -p 3000:80 toran-front
see it in localhost:3000
