clean:
	rm -f *.log

clean-db:
	rm -f *.db

really-clean: clean clean-db


test: clean-db
	poetry run python test_crud.py

run: really-clean 
	poetry run uvicorn server:app --reload --host 0.0.0.0