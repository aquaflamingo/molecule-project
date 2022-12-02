project=web3_app_scaffold

###############################################################
# CLIENT
###############################################################
web.start:
	@cd web; yarn start

###############################################################
# CHAIN
###############################################################
hh.node:
	@cd blockchain && yarn start:node

hh.compile:
	@pushd blockchain; yarn compile; popd

hh.deploy.local:
	@pushd blockchain; yarn deploy:local; popd

###############################################################
# IPFS
###############################################################
ipfs.start:
	@echo "Running IPFS daemon in --offline mode"
	@./ipfsd.sh

ipfs.clean:
	@./ipfsclean.sh
	@echo "Done"
