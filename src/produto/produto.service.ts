import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ListaProdutoDTO } from './dto/ListaProduto.dto';
import { ProdutoEntity } from './produto.entity';
import { Repository } from 'typeorm';
import { AtualizaProdutoDTO } from './dto/AtualizaProduto.dto';
import { CriaProdutoDTO } from './dto/CriaProduto.dto';

@Injectable()
export class ProdutoService {
  constructor(
    @InjectRepository(ProdutoEntity)
    private readonly produtoRepository: Repository<ProdutoEntity>,
  ) {}

  async criaProduto(dadosProduto: CriaProdutoDTO) {
    const produtoEntity = new ProdutoEntity();

    // produtoEntity.nome = dadosProduto.nome;
    // produtoEntity.valor = dadosProduto.valor;
    // produtoEntity.quantidadeDisponivel = dadosProduto.quantidadeDisponivel;
    // produtoEntity.descricao = dadosProduto.descricao;
    // produtoEntity.categoria = dadosProduto.categoria;
    // produtoEntity.caracteristicas = dadosProduto.caracteristicas;
    // produtoEntity.imagens = dadosProduto.imagens;

    // Object.assign(produtoEntity, dadosProduto as ProdutoEntity);
    Object.assign(produtoEntity, <ProdutoEntity>dadosProduto);

    return this.produtoRepository.save(produtoEntity);
  }

  async listProdutos() {
    const produtosSalvos = await this.produtoRepository.find({
      relations: {
        imagens: true,
        caracteristicas: true,
      },
    });
    const produtosLista = produtosSalvos.map(
      (produto) =>
        new ListaProdutoDTO(
          produto.id,
          produto.nome,
          produto.quantidadeDisponivel,
          produto.caracteristicas,
          produto.imagens,
        ),
    );
    return produtosLista;
  }

  async atualizaProduto(
    id: string,
    novosDados: AtualizaProdutoDTO,
  ): Promise<ProdutoEntity | null> {
    const entityName = await this.produtoRepository.findOneBy({ id });
    if (entityName === null) {
      throw new NotFoundException('O produto não foi encontrado');
    }

    Object.assign(entityName, <ProdutoEntity | unknown>novosDados);
    return this.produtoRepository.save(entityName);
  }

  async deletaProduto(id: string) {
    const resultado = await this.produtoRepository.delete(id);

    if (!resultado.affected) {
      throw new NotFoundException('O produto não foi encontrado');
    }
  }
}
